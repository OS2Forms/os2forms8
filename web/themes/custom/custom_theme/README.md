
### Prerequisites

Before being able to run this package you need to have node installed on your machine.

After node is installed you need a global package manager, as well. We use Yarn instead of NPM as it is way faster due to the way it utilizes local caching.

To install Yarn, follow the guide on: https://yarnpkg.com/en/docs/install#mac-stable 

### First time use
When you initialize this project, you need to install all required node dependencies (listed inside package.json). 

To install all node dependencies run:

`yarn install`

### Compile and build CSS and javascript

You can see which options this project has inside package.json's "scripts: { option }".

To compile CSS and javascript, run:

`yarn dev`

### Hot reload (live reload)

This starts up a local server which proxies the traffic from your local installation, to the server.

When editing a CSS or JS file, the page will instantly reload and display the changes.

Inside "./src/compile-settings.json" there is a "proxy" value. This value determines the path to your local live installation of this project.

In my local project i would access this project inside the browser with ex. "project.dev". Therefor this is the value i would enter inside the "proxy".

**As this value is developer specific and would vary from developer-to-developer, please don't commit your change to this file.**
