# Action: Load env

```yaml
- name: Load environment variables
  uses: k15g/action-load-env@edge
```


## Inputs


### `extras` (optional)

```yaml
- name: Load environment variables
  uses: k15g/action-load-env@edge
  with:
    extras: |
      VERSION=0.0.1
```


### `path` (optional)

```yaml
- name: Load environment variables
  uses: k15g/action-load-env@edge
  with:
    path: vars
```
