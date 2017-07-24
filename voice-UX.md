User Interaction For KCRW Alexa Skill
=====================================

Streaming Audio
---------------

* `Open KCRW` - Starts the KCRW simulcast stream.
* `Ask KCRW to play` - Same as above
* `Ask KCRW to play (radio | live | live stream | simulcast | KCRW)` - Same as above
* `Ask KCRW to play (music | eclectic 24 | music stream)` - Starts music stream
* `Ask KCRW to play (news | news 24 | news stream)` - Starts news stream.
* `Ask KCRW to (stop | pause)` - Stops currently playing stream.


Standard Audio Commands
-----------------------

* `Alexa, pause`
* `Alexa, stop`
* `Alexa, resume`
* ...


Asking about what's playing
---------------------------

* `Ask KCRW what's playing` - If the music stream is currently playing reads the currently playing song ("Now playing: $song by $artist"). For the other streams, announces "Now playing $show - $episode". If no stream is playing, looks up show info for the live stream in case someone listening via other means wants to know what's playing.
* `Ask KCRW what song is this` looks up the most recently played song on the current channel (or the live stream if no channel is currently playing).


Synonyms for Song Info
----------------------

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
----------------------

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


Either (defaults to track for music channel, show info otherwise)
-----------------------------------------------------------------

* What is this?
* Who is this?
* What is playing?
* What is playing now?
* Who is playing now?
