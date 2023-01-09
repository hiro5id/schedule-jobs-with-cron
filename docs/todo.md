- [ ] Test code with older versions of node example v4.
- [ ] Support overriding the logger function entirely
- [ ] Add support for seconds
- [ ] Add a "watcher" as separate project that checks to see if worker function has executed successfully in the last "x" iterations, if not then throw error
- [ ] main branch protection and force pull requests) 
- [ ] sub github repo for cron parser
- [ ] should I generate WebIDL definitions?

- [x] Add optional job name so that when logging out errors or messages, we know which job this is about. By default we should generate a random job ID if not explicitly specified. Or we could make the job name mandatory.
- [x] Create a "runner" promise that one can await on - possibly forever - as long as the job is running and re-scheduling itself.
