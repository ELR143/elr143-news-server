# elr143 News Server

You can find the hosted server here: https://elr143-news-server.onrender.com

This is an API which accesses application data programmatically. It mimics the backend functionality of a site such as Reddit and will provide information to the front end architecture.

## Please add the following files to connect to the databases:

.env.development -> this should contain PGDATABASE=nc_news
.env.test -> this should contain PGDATABASE=nc_news_test

### Setup Instructions:

1. In your terminal, navigate to your chosen directory, then copy and paste the following:
`git clone https://github.com/ELR143/elr143-news-server.git`

2. Navigate to the repo with `cd elr143-news-server`

3. Run `npm install`

4. Check your version of Node.js is v20.5.0 or higher --> `node -v`

5. Check your version of psql is 15.4 or higher --> `psql -V`

6. Create the following files in your project folder:
    --> .env.development
    --> .env.test

    - Inside .env.production, add PGDATABASE=nc_news
    - Inside .env.test, add PGDATABASE=nc_news_test

7. Setup the databases with the command `npm run setup-dbs` 
(For more information please see the package.json scripts)

8. Seed the databases with `npm run seed`

9. Run the tests with `npm test news-server`
    
