## Website Performance Optimization portfolio project

Your challenge, if you wish to accept it (and we sure hope you will), is to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

To get started, check out the repository, inspect the code,

### Getting started
Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok 8080
  ```
  1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights! Optional: [More on integrating ngrok, Grunt and PageSpeed.](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)

  Profile, optimize, measure... and then lather, rinse, and repeat. Good luck!

####Part 1: Optimize PageSpeed Insights score for index.html
-I changed the media type to print for css/print.css
-Got rid of the google fonts <link> and moved DOMContentLoaded down 75ms and used webfontloader instead
-Inlined CSS, async'd other JS (like Google Analytics)
-96/100 on PageSpeed Insights!


####Part 2: Optimize Frames per Second in pizza.html
a) Optimize scrolling animations to maintain >60fps
-Baselined the page and saw that frames were taking 23-25ms each. This is well above the 10ms allotted to A(Animations) in the RAIL framework.
-First, and most simply, I noticed that a constant of 200 background pizzas were being created and thus animated on scroll while only 18 were visible on screen. I reduced to 18 but then saw a couple background pizzas were missing now. Went back up and settled in at 22 pizzas. Measured and saw a huge improvement: frames were loading at 3.7-5.7ms each.
-Then, I looked at the Timeline tab of Dev Tools and saw that I was entering a forced reflow state because of a lot of calculations on the whole document within the UpdatePositions function.
-Noticed a document wide read call made within the loop that I moved outside the loop. Measured:
0.31ms-0.47ms - improved by another factor!

b) Optimize resize Pizzas to respond in under 5ms

-First I baselined to see that a resize action was taking >100ms. Looking into Chrome dev tools timeline, it was clear that most of the jank was being caused by the changePizzaSizes function in main.js. This would be an R (Response) under the RAIL framework allowing 100ms but still...
-I noticed a for loop which was repeatedly calculating several variables: querying the DOM for all pizzaContainers, calculating dx, and then calculating newwidth. Since I knew all of these would be constant in any particular call of the function, I moved them outside of the for loop. At this point, it was running at ~4.5ms per resize.
-Going further, I realized that the whole dx function is unnecessary. Instead stored the output of the switch statement as the % width needed and simply applied that. This got resize to <3ms per resize.

####Part 3: Extra-credit Optimizations
I took the build tools class and used gulp.js to make the following optimizations:
a) minify css
b) concatenate and minify js
c) losslessly optimize images

This was done with gulp.js and the package dependencies can be found in package.json
