## API Reference for ChatMaps (/login)
<hr/>

### POST
Inputs:


Output:


### GET
Inputs:
|Name|Type|DataType|
|----|----|--------|
session|cookie|String|

Output:
|Condition|HTTP Status Code|Body|Body DataType|
|---------|----------------|----|-------------|
|No session token in the cookies|401|{isLogged: false}|JSON
|Successfully validated session token|200|*|JSON
|Validation of session token failed|401|{isLogged: false}|JSON