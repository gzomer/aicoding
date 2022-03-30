# AI Coding

The future of programming is here: with AI Coding, developers focus on their knowledge of knowing what to do. AI Coding is an AI powered VSCode extension that boost developer productivity in four main areas:

![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/887/110/datas/gallery.jpg)

### AI auto code generation
Through a collaborative Human-AI coding loop, developers can express their ideas in natural language and AI Coding will generate/change/edit the code for you. Focus on getting more done by saying what needs to be done, and let the machine do the repetive work of creating code for you.

### AI auto debugging
Easily find the sources of bugs/errors and find fixes for them. Just copy the error message and AI Coding will automatically identify the source of error and even fix the bug for you.

### AI auto unit-testing
Developing code is not enough. Your code needs to be tested in order to make it production-ready. AI Coding generate unit tests in a single click. Just right click and select Generate unit-tests and AI Coding will do the hard work for you.

### AI auto documentation
Documenting code is also an important part of the developer flow, as others will review/edit your work in the future. For this, AI Coding helps you by automatically documenting your code with a single click.

## How we built it

AI Coding is powered by OpenAI Codex model. It is an interactive collaborative human-AI loop made of 4 steps:

![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/887/108/datas/gallery.jpg)

Current context - We need to pass the content of the file we want to generate code/edit to the Codex model. For this, the code for the current active text editor is extracted (if it is a new file, it will be empty, but Codex work with well with empty contexts as well).

![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/887/107/datas/gallery.jpg)

Instructions - The next step is to take the user instruction on what needs to be done. This is extracted from a text area in the left bottom corner, in the AI Coding panel. Some instructions are pre-made (such as the instructions for installing packages, generating tests, improving documentation). For theses cases, there is a set of specific prompts used for each use case.

![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/887/106/datas/gallery.jpg)

Generation - Next, both the instruction and context are sent to the OpenAI codex endpoint. The code is generated until no more code is generated.

![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/887/109/datas/gallery.jpg)

Finally, the resulting code is shown side by side in a diff view, the same view used for comparing Git changes. This allows the developer to review the changes and accept them in a single click. When accepting the changes, the file content is them updated with the generated code.

These are the 4 steps of the future of development: context, instruction, generate, and review. This loop can be repeated as many times as you want to develop any kind of application in any language. It is a fun, collaborative, and faster way to develop code. You won't want to go back to the old way!