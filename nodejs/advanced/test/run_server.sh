#!/bin/sh
echo "${sentiment}" > /usr/share/nginx/html/sentiment
echo "${messages}" > /usr/share/nginx/html/messages
nginx -g "daemon off;"
