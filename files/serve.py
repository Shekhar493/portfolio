#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from contextlib import suppress
from pathlib import Path

def main():
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))

    # Determine directory to serve
    script_dir = Path(__file__).resolve().parent
    serve_arg = sys.argv[1] if len(sys.argv) > 1 else None
    serve_env = os.environ.get("SERVE_DIR")

    target = Path(serve_arg or serve_env or script_dir)
    if not target.is_absolute():
        target = (script_dir / target).resolve()

    if not target.exists() or not target.is_dir():
        print(f"Error: Directory to serve does not exist: {target}", file=sys.stderr)
        print("Hint: pass a folder name: `python3 serve.py <folder>` or set SERVE_DIR=...", file=sys.stderr)
        sys.exit(1)

    os.chdir(target)

    handler = http.server.SimpleHTTPRequestHandler

    class QuietHandler(handler):
        def log_message(self, format, *args):
            sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format%args))

    with socketserver.TCPServer((host, port), QuietHandler) as httpd:
        try:
            print("\n==============================")
            print(" Static Server Started ")
            print("==============================")
            print(f"Serving directory: {target}")
            print(f"URL: http://{host}:{port}")
            print("Press Ctrl+C to stop.\n")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
        finally:
            with suppress(Exception):
                httpd.server_close()

if __name__ == "__main__":
    main()
