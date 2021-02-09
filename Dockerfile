FROM node:12.18.2

LABEL maintainer="bucai<1450941858@qq.com>"

ENV HOST 0.0.0.0

ADD . /app/

WORKDIR /app

RUN echo "Asia/Shanghai" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata && \
    echo "deb http://mirrors.aliyun.com/debian/ buster main non-free contrib" > /etc/apt/sources.list

RUN apt-get update && apt-get install -y --no-install-recommends libwebp-dev libjpeg-dev libpng-dev wget freetype2-demos libfreetype6-dev libfreetype6

RUN apt-get install -y zlib1g zlib1g.dev ruby zlib1g-dev

RUN wget https://nchc.dl.sourceforge.net/project/libpng/libpng16/1.6.37/libpng-1.6.37.tar.gz && \
  tar -zxvf libpng-1.6.37.tar.gz && \
  cd libpng-1.6.37 && ./configure && \
  make && make install

RUN apt-get install -y graphicsmagick

RUN tar xvzf ImageMagick.tar.gz && \
  rm ImageMagick.tar.gz && \
  cd ImageMagick* && \
  ./configure && \
  make -j4 && \
  make install && \
  ldconfig /usr/local/lib && \
  cd .. && rm -rf ImageMagick

RUN npm install --registry=https://registry.npm.taobao.org

CMD  nohup sh -c 'npm run start'
