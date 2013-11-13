
## Веб-интерфейс для Spacepro

> Внутренняя разработка компании [Стандарт-Н](http://standart-n.ru/)


#### Требования к серверу

```
  * Node.js 0.10.10 or newer
  * NPM.js 1.2.25 or newer
  * MongoDB 2.4.5 or newer
```

#### Запуск сервера в терминале

```
	$ spacepro run
```

### Создание сервиса

для этого нужно установить ```forever```

```
npm install -g forever
```

создадим в каталоге ```/etc/init.d``` файл ```spacepro``` и выставим ему права на исполнение

```
cd /etc/init.d/
touch spacepro
chmod 755 ./spacepro
```

далее откроем файл на редактирование спомощью ```nano``` и вставим в него следующий код

```
#!/bin/sh
#
### BEGIN INIT INFO
# Provides:          spacepro
# Required-Start:    $all
# Required-Stop:     $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: spacepro
# Description:       spacepro api server
# 
#
### END INIT INFO

export USER=root
export PWD=/root
export HOME=/root
export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules
export NODE_ENV=production

case "$1" in
'start')
exec forever start -a -l /var/log/spacepro.forever.log -o /var/log/spacepro.out.log -e /var/log/spacepro.err.log --sourceDir=/usr/local/lib/node_modules/spacepro/ spacepro.js run > /var/log/spacepro.init.log
;;
'stop')
exec forever stop /usr/local/lib/node_modules/spacepro/spacepro.js > /var/log/spacepro.init.log
;;
'restart')
exec forever -a -l /var/log/spacepro.forever.log -o /var/log/spacepro.out.log -e /var/log/spacepro.err.log restart /usr/local/lib/node_modules/spacepro/spacepro.js > /var/log/spacepro.init.log
;;
'status')
exec forever list
;;
*)
echo "Usage: $0 { start | stop | restart | status }"
exit 1
;;
esac
exit 0
```

в результате мы получим сервис ```/etc/init.d/spacepro``` 

```
/etc/init.d/spacepro start
/etc/init.d/spacepro status
/etc/init.d/spacepro stop
```

##### После этого можно добавить сервис в автозагрузку

добавить в автозагрузку

```
update-rc.d spacepro defaults
```

убрать запуск сервера из автозагрузки

```
update-rc.d spacepro remove
```



##### Как настроить logrotate

создаем файл конфигурации

```
touch /etc/logrotate.d/spacepro
```

открываем его спомощью ```nano``` и записываем туда:

```
/var/log/spacepro*.log {
    daily
    rotate 5
    create 644 root adm
    missingok
    notifempty
    compress
    delaycompress
    postrotate
      /etc/init.d/spacepro stop
      /etc/init.d/spacepro start
    endscript
}
```

применяем конфигурацию

```
logrotate /etc/logrotate.conf
```

далее можно протестировать

```
logrotate -f /etc/logrotate.conf
```


#### Как привязать сервер к доменному имени в nginx


```
  server {
    # порт, который слушает nginx
    listen 8080;
    # доменные имена
    server_name spacepro.ru www.spacepro.ru;
    # путь к логам
    access_log /var/log/nginx/spacepro.log;

    location / {
      # 127.0.0.1 - здесь мб адрес любой машины в сети
      # 3000 - порт который слушает запущенный нами сервер
      proxy_pass http://127.0.0.1:3000/;
      proxy_redirect off;
      proxy_set_header Host $host;
      proxy_set_header X-real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
```



#### License

The MIT License (MIT)

Copyright (c) 2013 aleksnick

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

