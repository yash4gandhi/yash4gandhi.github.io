# Writing workflow

Create a lowercase-hyphenated `.md` file here. Use the metadata below. Only `published: true` posts enter the build. No invented posts are supplied.

    ---
    title: Your title
    date: YYYY-MM-DD
    published: false
    ---

    Opening paragraph.

    ## Section heading

    Another paragraph.

The small built-in Markdown renderer supports paragraphs and second/third-level headings. HTML is escaped. Change `published` to `true` only when a post is ready. Build with `node scripts/build.mjs`. A browser CMS can be added later if preferred.
