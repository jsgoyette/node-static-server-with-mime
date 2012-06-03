node-static-server-with-mime
============================

A simple static server with mime types and no dependencies, all contained within a single file.

I wanted a script that I could call from any directory (thus that had no dependencies), but could 
server files with mime types (if anything, to get rid of the missing mime-type warnings in
the console). This scripts accomplishes just that.

Assuming the script is executable (chmod +x), run with:
`./server.js [port]`

To make the script available from any directory, place the file in you bash path, such as:

```
sudo cat server.js > /usr/bin/local/server
sudo chmod 755 server
```

Then just call from any directory:

`server [port]`