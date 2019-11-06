<h1>RoboComposer Website</h1>

This repository maintains the source code of the front-end and not the whole webserver. The changes of each commit/branch should be noted in the changelog file.
Please make sure that you generate an SSH key and edited in your profile settings under "ssh keys" (read about <a href="https://gitlab.com/help/ssh/README">SHH key generation</a>)
If you are not familiar with Git yet, then check out these links:
<ul>
    <li><a href="https://rogerdudler.github.io/git-guide/index.html">git-guide</a></li>
    <li><a href="https://rogerdudler.github.io/git-guide/files/git_cheat_sheet.pdf">git cheat sheet</a></li>
    <li><a href="https://www.youtube.com/results?search_query=Git+gitlab+tutorial">youtube videos</a></li>
</ul>

<h2>RULES:</h2>
- instead of npm please use yarn. Yarn uses npm but updates better the dependencies and makes it possible to work on the repository even in offline state. Please just accept that fact.

<h3>CHANGE PROCESS</h3>


1.  Make change and add some comments in your code.
2.  Commit to the according dev branch matching your name (dev-YOURNAME) and please add a comment to your commit.
3.  Contact Lim via Slack and please explain to him the change.
4.  Wait for approval and after that it will be merged to master-branch.


<h3>TESTING/DEPLOYMENT PROCESS</h3>
1. Perform minification (yarn build).
2. Deploy to dropbox "Apache/htdocs/dev".
3. Contact James and wait for review on "DEV" folder.
4. After approval, deploy to the public-facing branch on Apache, which is the "BUILD" folder.
5. Update changes to changelog in gitlab master branch.

