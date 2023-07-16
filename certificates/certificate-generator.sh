apt-get install wget libnss3-tools 
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
sudo mv mkcert-v1.4.3-linux-amd64 /usr/bin/mkcert
sudo chmod +x /usr/bin/mkcert
mkcert -install
mkcert -key-file key.pem -cert-file cert.pem 0.0.0.0 localhost 127.0.0.1 ::1
 
 