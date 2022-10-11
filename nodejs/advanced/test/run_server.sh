#!/bin/sh
echo "${Quix__Sdk__Token}" > /usr/share/nginx/html/sdk_token
echo "${Quix__Workspace__Id}" > /usr/share/nginx/html/workspace_id
echo "${sentiment}" > /usr/share/nginx/html/sentiment
echo "${messages}" > /usr/share/nginx/html/messages
nginx -g "daemon off;"
