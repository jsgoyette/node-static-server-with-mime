node-static-server-with-mime
============================

A simple Node.js static server with mime types and no dependencies, all contained within a single
file.

I wanted a utility script that I could call from any directory (having no dependencies), but 
that could serve files with mime types (if anything, to get rid of the missing mime-type warnings 
in the console). This script accomplishes just that.

Assuming the script is executable (`chmod +x`), run with:

```
./server.js [port]
```

To make the script available from any directory, place the file in your bash PATH, such as:

```
sudo cat server.js > /usr/local/bin/server
sudo chmod 755 /usr/local/bin/server
```

Then just call from any directory:

```
server [port]
```