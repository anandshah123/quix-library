import {Injectable} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HubConnection, HubConnectionBuilder, IHttpConnectionOptions} from "@microsoft/signalr";
import {map} from "rxjs/operators";
import {ParameterData} from "../models/parameter-data";
import {MessagePayload} from "../components/webchat/webchat.component";

@Injectable({
    providedIn: 'root'
})
export class QuixService {

    private token: string = "{placeholder:token}";
    public workspaceId: string = "{placeholder:workspaceId}";
    public messagesTopic: string = "{placeholder:messages}";
    public sentimentTopic: string = "{placeholder:sentiment}";


    readonly subdomain = "platform";
    readonly server = "" // leave blank

    public readerConnection: HubConnection;
    public readerConnectionPromise: Promise<void>;
    public writerConnection: HubConnection;
    public writerConnectionPromise: Promise<void>;

    constructor(
        private httpClient: HttpClient) {

        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let messagesTopic$ = this.httpClient.get(this.server + "messages_topic", {headers, responseType: 'text'});
        let sentimentTopic$ = this.httpClient.get(this.server + "sentiment_topic", {headers, responseType: 'text'});
        let workspaceId$ = this.httpClient.get(this.server + "workspace_id", {headers, responseType: 'text'});

        let value$ = combineLatest(
            messagesTopic$,
            sentimentTopic$,
            workspaceId$
        ).pipe(map(([messagesTopic, sentimentTopic, workspaceId])=>{
            return {messagesTopic, sentimentTopic, workspaceId};
        }));

        value$.subscribe(vals => {
            this.messagesTopic = vals.messagesTopic;
            this.sentimentTopic = vals.sentimentTopic;
            this.workspaceId = vals.workspaceId;
            this.ConnectToQuix(vals.workspaceId);
        });
    }

    private ConnectToQuix(workspaceId){
        const options: IHttpConnectionOptions = {
            accessTokenFactory: () => this.token,
        };

        this.readerConnection = new HubConnectionBuilder()
            .withUrl(`https://reader-${workspaceId}.${this.subdomain}.quix.ai/hub`, options)
            .withAutomaticReconnect()
            .build();

        this.readerConnectionPromise = this.readerConnection.start();

        this.writerConnection = new HubConnectionBuilder()
            .withUrl(`https://writer-${workspaceId}.${this.subdomain}.quix.ai/hub`, options)
            .withAutomaticReconnect()
            .build();

        this.writerConnectionPromise = this.writerConnection.start();
    }

    public getLastMessages(room: string): Observable<MessagePayload[]> {
        let payload =
            {
                'numericParameters': [
                    {
                        'parameterName': 'sentiment',
                        'aggregationType': 'None'
                    },
                    {
                        'parameterName': 'average_sentiment',
                        'aggregationType': 'None'
                    }
                ],
                'stringParameters': [
                    {
                        'parameterName': 'chat-message',
                        'aggregationType': 'None'
                    }
                ],

                "streamIds": [
                    room + "-output"
                ],
                "groupBy": [
                    "role",
                    "name"
                ],
            };

        return this.httpClient.post<ParameterData>(`https://telemetry-query-${this.workspaceId}.${this.subdomain}.quix.ai/parameters/data`, payload, {
                headers: {
                    "Authorization": "bearer " + this.token
                }
            }
        ).pipe(map(rows => {

            let result: MessagePayload[] = [];
            for (let i = 0; i < rows.timestamps.length; i++) {
                result.push({
                    timestamp: rows.timestamps[i],
                    message: rows.stringValues["chat-message"][i],
                    sentiment: rows.numericValues["sentiment"][i],
                    name: rows.tagValues["name"][i]
                });
            }
            return result;
        }));
    }

    public async sendMessage(room: string, role: string, name: string, message: string, phone: string, email: string) {
        let payload = [
            {
                "timestamp": new Date().getTime() * 1000000,
                "tags": {
                    "room": room,
                    "role": role,
                    "name": name,
                    "phone": phone,
                    "email": email
                },
                "id": "chat-message",
                "value": message
            }
        ];

        await this.writerConnection.invoke("SendEventData", "messages", room, payload);
    }
}