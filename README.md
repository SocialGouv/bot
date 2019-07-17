# @SocialGouv Bot

[![Travis CI Status][img-travis]][link-travis]

A Github bot for @SocialGouv projects.

> :warning: **This is a very experimental project for now. Don't expect too much yet!**

---

## Features

-   Auto-create branches when a new issue is opened by one of the repository collaborators.
-   Auto-create branches when `!branch` comment is posted on an issue by one of the repository
    collaborators.

### Roadmap

Those are the planned features:

-   Enforce naming rules for issues, branches & pull requests title and make it cutomizable via a
    `socialgouv.yml` file.
-   Auto-generate issues when new todos are detected within the source code.
-   Auto-close todo-releated issues when todos are removed from the source code.
-   Generate labels from `socialgouv.yml` file.
-   Extend config from GitHub repo (renovate like).

## Contribute

### Get started

1. Copy the `.env.example` file to `.env`.
2. Go to https://smee.io/new.
3. Copy the url in your `.env` file as the `WEBHOOK_PROXY_URL` value.

Then build and start your bundle:

```
yarn
yarn dev
```

You can now create a real Github app (forwarded to your local instance via
[smee.io](https://smee.io/)), install it and test it with some of your existing Github repositories.

## License

This project is open-sourced under the [Apache 2.0 license][link-license].

---

[img-travis]: https://img.shields.io/travis/SocialGouv/bot.svg?style=flat-square
[link-license]: https://github.com/SocialGouv/bot/blob/master/LICENSE
[link-travis]: https://travis-ci.com/SocialGouv/bot
