## Deployment
To deploy as static content within a spring boot app, copy all
files under the /public directory directly underneath the /src/main/resources/static
folder in the spring boot project.  The directory structure should look like this:
static/
    index.html
    global.css
    build/
        bundle.css
        bundle.js
        bundle.js.map