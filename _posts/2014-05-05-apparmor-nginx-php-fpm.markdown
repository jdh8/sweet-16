---
layout: post
title: AppArmor configuration for nginx and php-fpm
categories: Linux
tags: Ubuntu
---
[AppArmor][AppArmor] is the default
[<abbr title="mandatory access control">MAC</abbr>][MAC]
module on Ubuntu.  Unlike
[<abbr title="discretionary access control">DAC</abbr>][DAC]
in Un\*x, an AppArmor config lists what a process *can* access.  An
**enforce**d process can only access listed paths; a **complain**ing process
emits warning when accessing an unlisted path.

However, there is no default config for [nginx][nginx] and [php-fpm][php-fpm].
To prevent the web server being hacked, causing *systemic infection*, let's
write configs on our own!  The useful tool `aa-genprof` gets most of the jobs
done, but some paths are still missing, especially sockets.  Therefore, I
publish my settings as reference.

* Document roots are at /srv/www/\*/.
* I prefer [Unix domain sockets][Unix socket] to
  [<abbr title="Transmission Control Protocol">TCP</abbr> sockets].

[AppArmor]:       https://en.wikipedia.org/wiki/AppArmor
[DAC]:            https://en.wikipedia.org/wiki/Discretionary_access_control
[MAC]:            https://en.wikipedia.org/wiki/Mandatory_access_control
[network socket]: https://en.wikipedia.org/wiki/Network_socket
[nginx]:          http://nginx.org/
[php-fpm]:        http://php-fpm.org/
[Unix socket]:    https://en.wikipedia.org/wiki/Unix_domain_socket

The following is config for nginx.

	#include <tunables/global>

	/usr/sbin/nginx {
		#include <abstractions/apache2-common>
		#include <abstractions/base>
		#include <abstractions/nis>

		capability dac_override,
		capability net_bind_service,
		capability setgid,
		capability setuid,

		/etc/nginx/** r,
		/etc/ssl/openssl.cnf r,
		/proc/*/auxv r,
		/run/nginx.pid rw,
		/run/nginx.pid.oldbin w,
		/run/php5-fpm.sock rw,
		/srv/www/** r,
		/usr/sbin/nginx mr,
		/var/log/nginx/* w,
	}

The following is config for php-fpm.

	#include <tunables/global>

	/usr/sbin/php5-fpm {
		#include <abstractions/base>
		#include <abstractions/nameservice>
		#include <abstractions/php5>

		capability kill,
		capability setgid,
		capability setuid,

		/etc/php5/** r,
		/proc/*/auxv r,
		/proc/sys/kernel/ngroups_max r,
		/run/mysqld/mysqld.sock rw,
		/run/php5-fpm.pid rw,
		/run/php5-fpm.sock w,
		/srv/www/** r,
		/srv/www/html/wp-content/** rw,
		/srv/www/html/wp-content/cache/** rwk,
		/srv/www/magento/media/** rw,
		/srv/www/magento/var/** rwk,
		/tmp/ r,
		/tmp/** rwk,
		/usr/sbin/php5-fpm mrix,
		/var/log/php5-fpm.log* w,
	}
