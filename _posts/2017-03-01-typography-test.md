---
layout: post
title: Typography test
category: Typesetting
tag: Typography
---
[Lorem ipsum][lorem] dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et *italic and __bold italic__*. Ut enim ad
minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.  Duis aute irure **bold** dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
id est laborum.

[lorem]: https://en.wikipedia.org/wiki/Lorem_ipsum

> καὶ γνώσεσθε τὴν ἀλήθειαν καὶ ἡ ἀλήθεια ἐλευθερώσει ὑμᾶς.
> <cite>ΚΑΤΑ ΙΩΑΝΝΗΝ 8:32</cite>
>
> La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui.
> <cite>Déclaration des Droits de l'Homme et du Citoyen</cite>
>
> They who can give up essential liberty to obtain a little temporary safety,
> deserve neither liberty nor safety.
> <cite>Benjamin Franklin</cite>

# This is a h1 title
## This is a h2 title
### This is a h3 title
#### This is a h4 title
##### This is a h5 title
###### This is a h6 title

{% assign file = "1_taipei_sunrise_panorama_dxr_edit_141215_1.jpg" %}
{% assign origin = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/" | append: file %}

<a href="https://commons.wikimedia.org/wiki/File:{{ file }}">
	<img alt="Taipei sunrise panorama" src="{{ origin }}/640px-{{ file }}"
		srcset="{{ origin }}/320px-{{ file }} 320w,
			{{ origin }}/640px-{{ file }} 640w,
			{{ origin }}/800px-{{ file }} 800w,
			{{ origin }}/1024px-{{ file }} 1024w,
			{{ origin }}/1280px-{{ file }} 1280w">
</a>

If 1♣ ensures 3+ clubs
: With minimum strength, the probability of only 3 clubs is 21.5%.

If 1♣ can be 4-4-3-2
: With minimum strength, the probability of exactly 3 clubs is 20.4%, 4-4-3-2 5.19%.

|   W   |  N  |     E     |  S  |
|-------|-----|-----------|-----|
|       | 1♣  |     -     | 1NT |
| X[^1] |  -  | **-**[^2] |  ?  |

[^1]: [Takeout double](https://en.wikipedia.org/wiki/Takeout_double)
[^2]: Convert to business double
