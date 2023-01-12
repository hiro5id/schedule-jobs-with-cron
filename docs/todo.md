- [ ] Add the english schedule & crontab to the log message when the schedule finishes, when the next time it is scheduled to run.

- [ ] Add ability to **randomize** **schedule** based on a cron job

- [ ] Change message `Scheduling to trigger in the next 23724 ms` to show it in minutes instead of milisecodns to be more human friendly...

- [ ] Run **tests** in github on different versions of **operating systems** an node example: https://github.com/TooTallNate/node-https-proxy-agent/blob/master/.github/workflows/test.yml

- [ ] Support **overriding** the **logger function** entirely

- [ ] Add support for **seconds**

- [ ] Upon **startup** when logging out 'Scheduled to execute' also **log out the end date** if configured

- [ ] Add some **validations** for options input and other input... example **dates should be date objects**.

- [ ] Add **ending** based on fixed **number of iterations** executed.

- [ ] Add **statistics** for the number of times executed and errored. ?

- [ ] A **manual start** and **stop** property

- [ ] Add **documentation** on how to **contribute** and easy to find links (badge?)

- [ ] Add **examples** documentation

    - [ ] An exampe using various **options**

- [ ] Add a "**watcher**" as separate project that checks to see if worker function has executed successfully in the last "x" iterations, if not then throw error

- [ ] sub **github repo** for cron parser

- [ ] should I generate **WebIDL** definitions? Is it useful?

- [ ] **compentition**? https://github.com/breejs/bree

- [ ] I like the way this package.json is layed out with extra documentation bits about maintainers and contributors: https://github.com/Unitech/pm2/blob/master/package.json

- [x] A **runkit badge** to be able to get to the example even from **GitHub**.

- [x] main branch protection and force pull requests) 

- [x] Add optional job name so that when logging out errors or messages, we know which job this is about. By default we should generate a random job ID if not explicitly specified. Or we could make the job name mandatory.

- [x] Create a "runner" promise that one can await on - possibly forever - as long as the job is running and re-scheduling itself.

- [x] Add **automation** to **test** code with **older versions of node** example v14 and older.

    * Running jest code as github actions: https://github.com/marketplace/actions/run-jest
    * use specific node version: https://github.com/actions/setup-node

- [x] Add test **coverage reporting**

    * Here is an example: https://tnodes.medium.com/dynamic-badges-with-shields-io-and-runkit-9e80283f1b47 <--- this is only for creating dynamic badges if using a custom CI build pipeline.   

    - another example for test coverage: https://time2hack.com/test-coverage-label-with-github-actions/ < -- this one seems too complicated.
    - here is a project that uses codecov and a shield: https://github.com/moment/luxon <--- codecov needs to much access
    - coverage badge creator: https://www.npmjs.com/package/coverage-badge-creator?activeTab=readme
- [ ] .........
