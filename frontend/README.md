# Trying out predicates from clientside

## Doc reference

https://fuelbook.fuel.network/master/quickstart/frontend.html

```
npx create-react-app frontend --template typescript
npm install fuels @fuel-wallet/sdk --save
```

## After each change in predicate code

Make sure to run `forc build` in the backend folder. 
Then run:
`npx fuels typegen -i ../**/**/*-abi.json  -o ./src/types --predicate`
