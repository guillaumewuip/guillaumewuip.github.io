---
title: Style
layout: page 
---

# Titre 1

## Titre 2

### Titre 3

You see, je ne suis pas un simple danseur car il faut se recréer... pour recréer... a better you et finalement tout
refaire depuis le début. Tu vas te dire : J'aurais jamais cru que le karaté guy pouvait parler comme ça !

Si je t'emmerde, tu me le dis, je sais que, grâce à ma propre vérité on est tous capables de donner des informations à chacun et je ne cherche pas ici à mettre un point ! Et là, vraiment, j'essaie de tout coeur de donner la plus belle réponse de la terre !

Some **bold text**

Some *italic text*

A list of things:

- One thing
- Another thing
- Another another thing


A list of <i>ordered</i> things:

1. One thing
2. Another thing
3. Another another thing
4. One thing
5. Another thing
6. Another another thing
7. One thing
8. Another thing
9. Another another thing
10. One thing

A quote:

> Suspendisse tempus dolor nec risus sodales posuere. Proin dui dui, mollis a consectetur molestie, lobortis vitae tellus.

A break:

---

Chapters:

<div class="guide-chapters" >
<ol>
<li>The plan</li>
<li markdown="1">
[Files]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %})
</li>
<li markdown="1">
[Mails]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %}) 
</li>
<li markdown="1">
[Calendar and contacts]({{ site.baseurl }}{% link _posts/2020-12-01-using-google-less.md %}) 
</li>
<li class="tbd">Browser and search (TBD)</li>
<li class="tbd">Photos (TBD)</li>
</ol>
</div>

Inline code: `console.log('hello world')`

Full code block:

```javascript
function hello() {
  console.log('hello world');
}
```

Now a table:

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

<figure>
  <table>
    <thead>
      <tr>
        <th>Tables</th>
        <th style="text-align: center">Are</th>
        <th style="text-align: right">Cool</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>col 3 is</td>
        <td style="text-align: center">right-aligned</td>
        <td style="text-align: right">$1600</td>
      </tr>
      <tr>
        <td>col 2 is</td>
        <td style="text-align: center">centered</td>
        <td style="text-align: right">$12</td>
      </tr>
      <tr>
        <td>zebra stripes</td>
        <td style="text-align: center">are neat</td>
        <td style="text-align: right">$1</td>
      </tr>
    </tbody>
  </table>
  <figcaption>
    This is the table legend. Pretty pretty legend. 
  </figcaption>
</figure>

Images:

<figure>
  <img alt="a ramdom illustration" src="https://images.unsplash.com/photo-1605618485931-fdbf5623167f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80" />
  <figcaption>
    This is the image legend. Pretty pretty legend. 
  </figcaption>
</figure>

The End[^1]. Yeah[^2].

---

[^1]: this is a footnote. It should highlight if you click on the corresponding superscript number.

[^2]: hey there, i'm using no style please!
