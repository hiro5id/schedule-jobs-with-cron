# Readme

- [ ] Add a "watcher" that checks to see if worker function has exectued successfully in the last "x" iterations, if not then throw error
- [ ] Add optional job name so that when logging out errors or messages, we know which job this is about. By default we should generate a random job ID if not explicitly specified. Or we could make the job name mandatory.
- [x] Create a "runner" promise that one can await on - possibly forever - as long as the job is running and re-scheduling itself.
