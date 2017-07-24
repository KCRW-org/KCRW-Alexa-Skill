User Interaction For KCRW Alexa Skill
=====================================

Streaming Audio
~~~~~~~~~~~~~~~

* `Open KCRW` - Starts the KCRW simulcast stream, announces current episode and show ("Now playing $episode on $show") before streaming.

* `Ask KCRW to (play | play radio | play live | play simulcast)` - Same as above

* `Ask KCRW to play (music | eclectic 24)` - Starts music stream

* `Ask KCRW to play news` - Starts news stream, announces current episode and show before streaming.


Asking about what's playing
~~~~~~~~~~~~~~~~~~~~~~~~~~~

* `Ask KCRW what's playing` - If the music stream is currently playing reads the currently playing song ("Now playing: $song by $artist"). For the other streams, announces "Now playing $episode on $show". If no stream is playing, assumes the live stream (asker may be listening to the radio).

* `Ask KCRW (what song is this | who sings this song | what song is playing | ...)` looks up the last played song on the currently playing channel (or the live stream if no channel is currently playing).


Synonyms for Song Info
~~~~~~~~~~~~~~~~~~~~~~

* Who sings this song?
* Who plays this song?
* Who sings this track?
* Who plays this track?
* What is this track?
* What is this song?
* What song is this?
* What track is this?
* What band is this?
* What track is playing?
* What band is playing?
* Who is this band?
* Who sings this song?
* Who plays this song?
* Who is playing this song?
* Who is singing this song?
* Who is playing this track?
* Who is singing this track?
* Who is this singer?


Synonyms for Show Info
~~~~~~~~~~~~~~~~~~~~~~

* What show is this?
* What program is this?
* What is this show?
* What is this program?
* What show is playing?
* What program is playing?
* What show is playing now?
* What program is playing now?
* Who is this D.J.?
* Who is this host?
* What is this program?
* Who hosts this show?
* Who hosts this program?
* Who D.J.'s this show?
* Who D.J.'s this program?


Either (defaults to track for music channel)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* What is this?
* Who is this?
* What is playing?
* What is playing now?
* Who is playing now?
