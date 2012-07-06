node-static-server-with-mime
============================

A simple Node.js static server with mime types and no dependencies, all contained within a single
file.

I wanted a utility script that I could call from any directory (having no dependencies), but 
that could serve files with mime types (if anything, to get rid of the missing-mime-type warnings 
in the console). This script fulfills these needs.

The server also includes a default index page: unless there is an index.html in the directory, the 
server will produce an index page similar to apache.

To make the script available from any directory, place the file in your PATH, such as:

```
mkdir /my/path/bin
cat server.js  > /my/path/bin/server
chmod +x /my/path/bin/server
echo 'export PATH=$PATH:/my/path/bin' >> ~/.bash_profile
source ~/.bash_profile
```

Then just call from any directory:

```
server [port]
```