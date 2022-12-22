Edit nginx.conf, uncomment everything and edit to match your domain

Run 

`$ docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d example.org`

To Renew

`docker compose run --rm certbot renew`