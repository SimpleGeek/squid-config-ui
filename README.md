# Squid Config UI
Squid Config UI is a web UI built with svelte.  For more info on svelte, see [svelte.dev](https://svelte.dev).

## About
Squid config UI (SCU) provides a web interface over the [squid configuration api](https://github.com/LiveByTheCode/squid-configuration-services).  Currently, the app has two main functions: allowing for maintenance of a proxy whitelist,
and implementing temporary bypasses of the whitelist.  If you want to run the app, see the list of instructions in the
deployment section of this document.

## Deployment
Note: Each set of deployment instructions assumes you're using a command line.  If you want
to do this with your GUI, the process should be the same, just substitute
the GUI action needed to complete the appropriate command line option.
These instructions also assume you have git, node, and npm installed.  (Npm comes
with any reasonably recent version of node.)

One more caveat: the local IP of the server hosting the API back end is hardcoded into the project
at the moment.  Currently, this code is in two places, Login.svelte and httphelper.js.  If your IP
differs from the one in this project, you'll need to correct that.  See [issue number 7](https://github.com/SimpleGeek/squid-config-ui/issues/7).

### Running in dev mode
First, create a directory to hold the source of the project, and then change into it.
The rest of the work will be done from here.

Next, you'll need to clone the source of the application:
```
git clone https://github.com/SimpleGeek/squid-config-ui.git
```

Now, install the project dependencies:
```
npm install
```

Lastly, just run the project in dev mode:
```
npm run dev
```

The project should be accessible at http://localhost:5000.  Note that this deployment uses rollup,
which provides live reload functionality if you're making code changes.

### Deploying as part of a spring boot app
To deploy as static content within a spring boot app, copy all
files under the /public directory directly underneath the /src/main/resources/static
folder in the spring boot project.  The directory structure should look like this:

```
static
├── build
│   ├── bundle.css
│   ├── bundle.js
│   └── bundle.js.map
├── global.css
└── index.html
```

No further action is needed.  The UI should be reachable at http://localhost:YOUR_SPRING_BOOT_PORT/index.html
once your app is running.

### Running the app using npm tools
First, you need to create a local directory in which to store the application.
The name isn't important; it can be anything you like.  Once you've created
the directory, go ahead and change into that directory, as that's where you'll
be doing the remainder of the work.

Next, you'll need to clone the source of the application:
```
git clone https://github.com/SimpleGeek/squid-config-ui.git
```

Now, install the project dependencies:
```
npm install
```

Now that the project dependencies are installed, it's time to create a build:
```
npm run build
```

Once the build has finished, you can then run the production version of the app:
```
npm run start
```

As configured in the package.json file of this project, the app will be accesible
over your network through port 5000 by default when you run the project using `npm run start`.
If you need to change the port the application is hosted on, edit the package.json file,
and add an argument to the sirv command associated with the "start" command.  The argument
to override the default port should look like this:
```
--port xxxx
```