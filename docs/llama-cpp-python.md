---
sidebar_position: 2
sidebar_label: llama-cpp-python
tags: [Python, LLM]
last_update:
  date: 2025-08-13
---

# llama-cpp-python

Notes on using [llama-cpp-python][lib-github].

### Basic Usage

```python
from llama_cpp import Llama

llm = Llama.from_pretrained(
    repo_id="google/gemma-3-1b-it-qat-q4_0-gguf",
    filename="*q4_0.gguf",
    n_gpu_layers=-1,
    n_ctx=4096,
    verbose=False,
    seed=42,
)
```

### Enabling Logits on Output Tokens

To obtain logits for all tokens, set `logits_all=True` when initializing the model.
This enables the model to return `logprobs` values in completions instead of `None`.

```python
llm = Llama.from_pretrained(
    ...,
    logits_all=True # this is required
)
```

When generating a completion, set both `logprobs` and `top_logprobs` in the call.
If only `logprobs` is set, `top_logprobs` defaults to `None`, and no `logprobs` are returned ([reference][logprobs-reference]).

```python
response = llm.create_chat_completion(
    ...,
    logprobs=True,
    top_logprobs=10 # list top 10 probability for each token
)
```

[lib-github]: https://github.com/abetlen/llama-cpp-python
[logprobs-reference]: https://github.com/abetlen/llama-cpp-python/blob/main/llama_cpp/llama_chat_format.py#L676
