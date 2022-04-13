import {Injectable} from '@angular/core';
import {RestaurantDatabaseService} from "./restaurant-database.service";
import {User} from "../models/user.model";
import {Restaurant} from "../models/restaurant.model";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    
    constructor() {
    }
    
    getDatabaseRestaurant(): any {
        return RestaurantDatabaseService.db;
    }
    
    register(user: User, callback) {
        function txFunction(tx: any) {
            let sql: string = "INSERT INTO users(username, password, firstName, lastName) VALUES(?, ?, ?, ?);";
            let options = [
                user.username,
                user.password,
                user.firstName,
                user.lastName
            ];
            tx.executeSql(sql, options, callback, RestaurantDatabaseService.errorHandler);
        }
        
        this.getDatabaseRestaurant().transaction(txFunction, RestaurantDatabaseService.errorHandler, () => console.log("Success: insert user transaction successfully"));
    }
    
    selectAllUser(): Promise<any> {
        let options = [];
        let users: User[] = [];
        
        return new Promise((resolve, reject) => {
            function txFunction(tx) {
                let sql = "SELECT * FROM users;";
                
                tx.executeSql(sql, options, (tx, results) => {
                    if (results.rows.length > 0) {
                        for (let i = 0; i < results.rows.length; i++) {
                            let row = results.rows[i];
                            let user = new User(
                                row['username'],
                                row['password'],
                                row['firstName'],
                                row['lastName']
                            );
                            user.userId = row['userId'];
                            users.push(user);
                        }
                        resolve(users);
                    }
                    // reject
                    else {
                        reject("No users found");
                    }
                }, RestaurantDatabaseService.errorHandler)
            }
            
            this.getDatabaseRestaurant().transaction(txFunction, RestaurantDatabaseService.errorHandler, () => console.log("Success: selectAllUser transaction successfully"));
        });
    }
}