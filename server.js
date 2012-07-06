#!/usr/local/bin/node

var http = require('http')
  , url = require('url')
  , path = require('path')
  , fs = require('fs')
  , port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = decodeURIComponent(url.parse(request.url).pathname)
    , filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {

    // if requested file/dir does not exist, return 404
    if (!exists) {
      console.log('File not found: ' + filename);
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end('404 Not Found\n');
      return;
    }

    // get info on requested file/dir
    fs.stat(filename, function (err, filestats) {

      if (err) {
        console.log('Error reading stats:', err);
      }

      var isdir = filestats.isDirectory();

      // if is directory and index.html exists, use index.html
      // NB: server will respond differently depending whether or not uri has a trailing slash
      if (isdir) {
        if (fs.existsSync(filename + 'index.html')) {
          filename += 'index.html';
          isdir = false;
        }
      }

      // if is directory and there is no index.html, then write apache-style index page
      if (isdir) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<html><head><style>td{padding:0 20px 0 0;}</style></head>');
        response.write('<body><h2>Index of ' + filename + '</h2><table>');
        fs.readdir(filename, function(err, files) {
          if (err) {
            console.log('Error reading directory:', err);
          } else {
            for (var index in files) {
              var st = fs.statSync(path.join(filename, files[index]))
                , trslash = st.isDirectory() ? '/' : ''
                , str = '<tr><td><a href=\"' + path.join(uri, files[index]) + trslash +
                    '\">' + files[index] + trslash + '</a> ' + '</td><td>' +
                    st.size + '</td><td>' + st.mtime + '</td></tr>';
              response.write(str);
            }
          }
          response.end('</table></body></html>');
        });

      // else return file
      } else {
        fs.readFile(filename, 'binary', function(err, file) {
          if (err) {
            console.log('Error loading path: ' + err.path);
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('500 Error\n');
            return;
          }
          var content_type = mime.lookupExtension(path.extname(filename), 'text/plain');
          response.writeHead(200, {'Content-Type': content_type});
          response.write(file, 'binary');
          response.end();
        });
      }

    });
  });

}).listen(parseInt(port, 10));

console.log('Static file server running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown');

// from https://github.com/ry/node_chat
var mime = {
  // returns MIME type for extension, or fallback, or octet-steam
  lookupExtension : function(ext, fallback) {
    return mime.TYPES[ext.toLowerCase()] || fallback || 'application/octet-stream';
  },
  TYPES : { '.3gp'   : 'video/3gpp'
          , '.a'     : 'application/octet-stream'
          , '.ai'    : 'application/postscript'
          , '.aif'   : 'audio/x-aiff'
          , '.aiff'  : 'audio/x-aiff'
          , '.asc'   : 'application/pgp-signature'
          , '.asf'   : 'video/x-ms-asf'
          , '.asm'   : 'text/x-asm'
          , '.asx'   : 'video/x-ms-asf'
          , '.atom'  : 'application/atom+xml'
          , '.au'    : 'audio/basic'
          , '.avi'   : 'video/x-msvideo'
          , '.bat'   : 'application/x-msdownload'
          , '.bin'   : 'application/octet-stream'
          , '.bmp'   : 'image/bmp'
          , '.bz2'   : 'application/x-bzip2'
          , '.c'     : 'text/x-c'
          , '.cab'   : 'application/vnd.ms-cab-compressed'
          , '.cc'    : 'text/x-c'
          , '.chm'   : 'application/vnd.ms-htmlhelp'
          , '.class'   : 'application/octet-stream'
          , '.com'   : 'application/x-msdownload'
          , '.conf'  : 'text/plain'
          , '.cpp'   : 'text/x-c'
          , '.crt'   : 'application/x-x509-ca-cert'
          , '.css'   : 'text/css'
          , '.csv'   : 'text/csv'
          , '.cxx'   : 'text/x-c'
          , '.deb'   : 'application/x-debian-package'
          , '.der'   : 'application/x-x509-ca-cert'
          , '.diff'  : 'text/x-diff'
          , '.djv'   : 'image/vnd.djvu'
          , '.djvu'  : 'image/vnd.djvu'
          , '.dll'   : 'application/x-msdownload'
          , '.dmg'   : 'application/octet-stream'
          , '.doc'   : 'application/msword'
          , '.dot'   : 'application/msword'
          , '.dtd'   : 'application/xml-dtd'
          , '.dvi'   : 'application/x-dvi'
          , '.ear'   : 'application/java-archive'
          , '.eml'   : 'message/rfc822'
          , '.eps'   : 'application/postscript'
          , '.exe'   : 'application/x-msdownload'
          , '.f'     : 'text/x-fortran'
          , '.f77'   : 'text/x-fortran'
          , '.f90'   : 'text/x-fortran'
          , '.flv'   : 'video/x-flv'
          , '.for'   : 'text/x-fortran'
          , '.gem'   : 'application/octet-stream'
          , '.gemspec' : 'text/x-script.ruby'
          , '.gif'   : 'image/gif'
          , '.gz'    : 'application/x-gzip'
          , '.h'     : 'text/x-c'
          , '.hh'    : 'text/x-c'
          , '.htm'   : 'text/html'
          , '.html'  : 'text/html'
          , '.ico'   : 'image/vnd.microsoft.icon'
          , '.ics'   : 'text/calendar'
          , '.ifb'   : 'text/calendar'
          , '.iso'   : 'application/octet-stream'
          , '.jar'   : 'application/java-archive'
          , '.java'  : 'text/x-java-source'
          , '.jnlp'  : 'application/x-java-jnlp-file'
          , '.jpeg'  : 'image/jpeg'
          , '.jpg'   : 'image/jpeg'
          , '.js'    : 'application/javascript'
          , '.json'  : 'application/json'
          , '.log'   : 'text/plain'
          , '.m3u'   : 'audio/x-mpegurl'
          , '.m4v'   : 'video/mp4'
          , '.man'   : 'text/troff'
          , '.mathml': 'application/mathml+xml'
          , '.mbox'  : 'application/mbox'
          , '.mdoc'  : 'text/troff'
          , '.me'    : 'text/troff'
          , '.mid'   : 'audio/midi'
          , '.midi'  : 'audio/midi'
          , '.mime'  : 'message/rfc822'
          , '.mml'   : 'application/mathml+xml'
          , '.mng'   : 'video/x-mng'
          , '.mov'   : 'video/quicktime'
          , '.mp3'   : 'audio/mpeg'
          , '.mp4'   : 'video/mp4'
          , '.mp4v'  : 'video/mp4'
          , '.mpeg'  : 'video/mpeg'
          , '.mpg'   : 'video/mpeg'
          , '.ms'    : 'text/troff'
          , '.msi'   : 'application/x-msdownload'
          , '.odp'   : 'application/vnd.oasis.opendocument.presentation'
          , '.ods'   : 'application/vnd.oasis.opendocument.spreadsheet'
          , '.odt'   : 'application/vnd.oasis.opendocument.text'
          , '.ogg'   : 'application/ogg'
          , '.p'     : 'text/x-pascal'
          , '.pas'   : 'text/x-pascal'
          , '.pbm'   : 'image/x-portable-bitmap'
          , '.pdf'   : 'application/pdf'
          , '.pem'   : 'application/x-x509-ca-cert'
          , '.pgm'   : 'image/x-portable-graymap'
          , '.pgp'   : 'application/pgp-encrypted'
          , '.pkg'   : 'application/octet-stream'
          , '.pl'    : 'text/x-script.perl'
          , '.pm'    : 'text/x-script.perl-module'
          , '.png'   : 'image/png'
          , '.pnm'   : 'image/x-portable-anymap'
          , '.ppm'   : 'image/x-portable-pixmap'
          , '.pps'   : 'application/vnd.ms-powerpoint'
          , '.ppt'   : 'application/vnd.ms-powerpoint'
          , '.ps'    : 'application/postscript'
          , '.psd'   : 'image/vnd.adobe.photoshop'
          , '.py'    : 'text/x-script.python'
          , '.qt'    : 'video/quicktime'
          , '.ra'    : 'audio/x-pn-realaudio'
          , '.rake'  : 'text/x-script.ruby'
          , '.ram'   : 'audio/x-pn-realaudio'
          , '.rar'   : 'application/x-rar-compressed'
          , '.rb'    : 'text/x-script.ruby'
          , '.rdf'   : 'application/rdf+xml'
          , '.roff'  : 'text/troff'
          , '.rpm'   : 'application/x-redhat-package-manager'
          , '.rss'   : 'application/rss+xml'
          , '.rtf'   : 'application/rtf'
          , '.ru'    : 'text/x-script.ruby'
          , '.s'     : 'text/x-asm'
          , '.sgm'   : 'text/sgml'
          , '.sgml'  : 'text/sgml'
          , '.sh'    : 'application/x-sh'
          , '.sig'   : 'application/pgp-signature'
          , '.snd'   : 'audio/basic'
          , '.so'    : 'application/octet-stream'
          , '.svg'   : 'image/svg+xml'
          , '.svgz'  : 'image/svg+xml'
          , '.swf'   : 'application/x-shockwave-flash'
          , '.t'     : 'text/troff'
          , '.tar'   : 'application/x-tar'
          , '.tbz'   : 'application/x-bzip-compressed-tar'
          , '.tcl'   : 'application/x-tcl'
          , '.tex'   : 'application/x-tex'
          , '.texi'  : 'application/x-texinfo'
          , '.texinfo' : 'application/x-texinfo'
          , '.text'  : 'text/plain'
          , '.tif'   : 'image/tiff'
          , '.tiff'  : 'image/tiff'
          , '.torrent' : 'application/x-bittorrent'
          , '.tr'    : 'text/troff'
          , '.txt'   : 'text/plain'
          , '.vcf'   : 'text/x-vcard'
          , '.vcs'   : 'text/x-vcalendar'
          , '.vrml'  : 'model/vrml'
          , '.war'   : 'application/java-archive'
          , '.wav'   : 'audio/x-wav'
          , '.wma'   : 'audio/x-ms-wma'
          , '.wmv'   : 'video/x-ms-wmv'
          , '.wmx'   : 'video/x-ms-wmx'
          , '.wrl'   : 'model/vrml'
          , '.wsdl'  : 'application/wsdl+xml'
          , '.xbm'   : 'image/x-xbitmap'
          , '.xhtml' : 'application/xhtml+xml'
          , '.xls'   : 'application/vnd.ms-excel'
          , '.xml'   : 'application/xml'
          , '.xpm'   : 'image/x-xpixmap'
          , '.xsl'   : 'application/xml'
          , '.xslt'  : 'application/xslt+xml'
          , '.yaml'  : 'text/yaml'
          , '.yml'   : 'text/yaml'
          , '.zip'   : 'application/zip'
          }
};
