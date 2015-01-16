# {{name}}
This site is built with the help of [Bastet](https://github.com/itsravenous/bastet), a lightweight, component-focused static site builder.

## Getting started
Install dependencies:

`npm install`

You will also need [Ruby](https://www.ruby-lang.org), SASS and the sass-globbing plugin installed. Ideally, we'd be using libsass to keep it node-y, but we need globbing support in sass which isn't available in libsass. Once you've got Ruby installed (if you're on Linux or OSX, you likely already have):

`gem install sass sass-globbing`

## Creating your site components
Create a new component:

`bastet create component --id god_avatar --name "God Avatar"`

a new page template:

`bastet create template --id god_profile --name "God profile template"`

or a new page instance:

`bastet create page --template god_profile --id ra --title "Ra's profile page"`

## Compiling the site
Bastet sites use [Gulp](http://gulpjs.com/) to compile the various source files to HTML, CSS and JavaScript that your browser can render.

Build the site and compile and reload browser on changes:

`gulp`

