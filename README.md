# Ditch Day Map
This map was used for the [Caltech](http://www.caltech.edu)
[Ditch Day](https://www.admissions.caltech.edu/content/traditions-and-pranks) 
Zootopia stack in 2016 
(Adam Ball, Melissa Chang, Nick Cho, Shi En Kim, Bryant Lin).
This map can be generalized for future stacks.  Feel free to
contact me (Bryant mr.b.lin.7 \[AT\] gmail \[DOT\] com) for any questions on
how to use it.

## Setup
You need a webhosting service and a Google Maps API key.  Fortunately
these are pretty easy to get.  I just Googled free webhosting and
ended up hosting it on [https://x10hosting.com](https://x10hosting.com).
You can also host it on your personal Caltech site if you have it set up.

The Google Maps Javascript API is available 
[here](https://developers.google.com/maps/documentation/javascript/).
Follow the instructions by clicking on "GET STARTED."  The free
plan should be more than enough for the plan.

## Notes and Usage
This setup is relatively "jank", but should work for the purpose of 
Ditch Day.  Also, there are a relatively small number of places that
need to be edited so you can get the map up and running in no time.
Feel free to clean up and improve on the code if you would like.

### Add your API key.
In [test\_map.html](./test_map.html), make sure that you change 
'YOUR\_GOOGLE\_API\_KEY'
to your Google Maps Javascript API key.  This should be the only change you
need in the HTML file.

#### Create labels, markers, etc.
Functions in the [test\_load\_map.js](./test_load_map.js) file should help
you create markers, labels, etc.

## Licensing
This is available under the [Apache 2.0 license](./LICENSE).
I am also using [Google MapLabel](https://github.com/googlemaps/js-map-label)
which is licensed under an [Apache 2.0 license](./GOOGLE_LICENSE).  The
license generally means you can use/modify/distribute the code,
but you MUST include the license included for that part of the code.

Copyright 2016 Bryant Lin

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
