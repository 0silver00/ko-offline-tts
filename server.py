import http.server
from http.server import HTTPServer


class CORPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        super().end_headers()


if __name__ == '__main__':
    server = HTTPServer(('', 8080), CORPHandler)
    print('서버가 http://localhost:8080 에서 실행 중입니다')
    server.serve_forever()
