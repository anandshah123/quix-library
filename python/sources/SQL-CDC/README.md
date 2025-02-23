# SQL CDC

This SQL Change Detection Capture (CDC) will stream changes detected in your SQL Server database into a Quix topic.

## Environment variables

The code sample uses the following environment variables:

- **output**: The output topic for the captured data.
- **driver**: The driver required to access your database. e.g. `\{/opt/microsoft/msodbcsql18/lib64/libmsodbcsql-18.1.so.1.1\}`
- **server**: The server address.
- **userid**: The user ID.
- **password**: The password.
- **database**: The database name.
- **table_name**: The table to monitor.
- **last_modified_column**: The column holiding the last modified or update date and time. e.g. `timestamp`
- **time_delta**: The amount of time in the past to look for data.  It should be in this format. `0,0,0,0,0` These are seconds, minutes, hours, days, weeks. `30,1,0,0,0` therefore this is 1 minute and 30 seconds.
- **offset_is_utc**: True or False depending on whether the last_modified_column is in UTC.
- **columns_to_drop**: Comma separated list of columns to exclude from data copied from the target table to Quix. 
- **columns_to_rename**: Columns to rename while streaming to Quix. This must be valid json e.g. `\{"DB COLUMN NAME":"QUIX_COLUMN_NAME"\}` or `\{"source_1":"dest_1", "source_2":"dest_2"\}`
- **poll_interval_seconds**: How often to check for new data in the source table.

Note that the columns to rename and columns to drop settings do not affect the source database. They are used when streaming data into Quix.

Driver and columns to rename should include `{` and `}` and the start and end of their values and these MUST be escaped with a `\`.

## Docs

Check out the [SDK docs](https://quix.ai/docs/sdk/introduction.html) for detailed usage guidance.

## How to run
Create a [Quix](https://portal.platform.quix.ai/self-sign-up?xlink=github) account to edit or deploy this application without a local environment setup.

Alternatively, you can learn how to set up your local environment [here](https://quix.ai/docs/sdk/python-setup.html).