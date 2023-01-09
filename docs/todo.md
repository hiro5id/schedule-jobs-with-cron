- [ ] Add ability to **randomize** **schedule**

- [ ] Upon **startup** when logging out 'Scheduled to execute' also **log out the end date** if configured

- [ ] Add some **validations** for options input and other input... example **dates should be date objects**.

- [ ] Add **ending** based on fixed **number of iterations** executed.

- [ ] Add **statistics** for the number of times executed and errored. ?

- [ ] A **manual start** and **stop** property

- [ ] Add **automation** to **test** code with **older versions of node** example v14 and older.

    * Running jest code as github actions: https://github.com/marketplace/actions/run-jest
    * use specific node version: https://github.com/actions/setup-node

- [ ] Add test **coverage reporting**

    * Here is an example: https://tnodes.medium.com/dynamic-badges-with-shields-io-and-runkit-9e80283f1b47    

    - another example for test coverage: https://time2hack.com/test-coverage-label-with-github-actions/
    - here is a project that uses codecov and a shield: https://github.com/moment/luxon

- [ ] Support **overriding** the **logger function** entirely

- [ ] Add support for **seconds**

- [ ] Add a "**watcher**" as separate project that checks to see if worker function has executed successfully in the last "x" iterations, if not then throw error

- [ ] sub **github repo** for cron parser

- [ ] should I generate **WebIDL** definitions? Is it useful?

- [ ] **compentition**? https://github.com/breejs/bree

- [x] main branch protection and force pull requests) 

- [x] Add optional job name so that when logging out errors or messages, we know which job this is about. By default we should generate a random job ID if not explicitly specified. Or we could make the job name mandatory.

- [x] Create a "runner" promise that one can await on - possibly forever - as long as the job is running and re-scheduling itself.
