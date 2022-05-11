FROM ubuntu:16.04
# update ubuntu config
RUN apt-get update -y
RUN apt-get install -y \
 				apache2 \
 				git \
				vim
COPY . /var/www/html/
# port binding
EXPOSE 80
# run
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]