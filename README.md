# Dollar Cost Averaging for Tokocrypto

Help me to buy coin daily while I'm sleeping or watching BoJack

## How To run
1. create .env file (copy the template from .env.example)
2. 
```shell
docker-compose build
```
3.
```shell
docker-compose up -d
```

## TODO
- [X] Set up API signed header
- [X] Order API
- [X] DCA Order
- [X] Scheduler (Agenda.js)
- [X] Save Transaction in DB
- [X] Report Transaction (via telegram)
- [ ] Rebalancing Algorithm for 2 coin (to keep coin percentage the - same in portofolio)
- [ ] Support rebalancing for > 2 coin