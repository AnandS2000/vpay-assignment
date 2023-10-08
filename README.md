# vpay-assignment

## REST API

To run the project:-
### Step-1
open the project in vs code and run command
-npm install

### Step-2
Create a database and import the given cdn file into the database https://drive.google.com/file/d/1YfhCPZbofAekMy9tPH_7ZXChVX8w_OUF/view?usp=sharing
Note- here "data"- is of type Date and "seats" and "amount" is of thye Number.

### Step-3
remove .example extension from .env.example file and add your database URL to CONNECTION_STRING.

Your Project is good to go.

# API Documentation

### Api 1: /api/total_items
@desc Get Total item sold in Marketting for last in q3 of the year
@route GET /api/total_items
@access public
@parameter (parameters: start_date, end_date, department):
example:- {
             "start_date": "2022-10-10T04:11:28.000+00:00",
             "end_date": "2023-04-21T13:13:21.000+00:00",
             "department": "Marketting"
          }

### Api 2: /api/nth_most_total_item
@desc Get the nth most sold item in terms of quantity or price
@route GET /api/nth_most_total_item
@access Public
@parameters item_by: (quantity, price), start_date, end_date
example:- {
             "item_by": "amount",
             "start_date": "2022-10-10T04:11:28.000+00:00",
             "end_date": "2023-04-21T13:13:21.000+00:00"
          }
          
### Api 3: /api/percentage_of_department_wise_sold_items
@desc Get the percentage of sold items department-wise
@route GET /api/percentage_of_department_wise_sold_items
@access Public
@parameters start_date, end_date
example:- {
             "start_date": "2022-10-10T04:11:28.000+00:00",
             "end_date": "2023-04-21T13:13:21.000+00:00"
          }
          
### Api 4: /api/monthly_sales
@desc Get the monthly sales for any product
@route GET /api/monthly_sales
@access Public
@parameters product_id
