# Cloud Week 3 - image & User Data & Nginx

## A. Create setup image with a script
0. Refer to [steps 0 through 7](https://github.com/bazmurphy/node-visitor-count/blob/main/README.md) on Baz's Readme
1. Advanced details > User Data - Enter user data in the field.

![Advanced details](https://user-images.githubusercontent.com/107769663/233480020-26ab5d91-e08e-4edb-8d41-d300c833d5ad.png)
```bash
#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_19.x | bash - &&\
apt-get install -y nodejs
npm i pm2 -g
```
![User Data](https://user-images.githubusercontent.com/107769663/233480893-bcda1322-43c4-4867-9bbb-5d83d9228fe5.png)

2. Click "Launch instance"
3. Wait for approximately 10 minutes to allow the EC2 instance to install Node.js and PM2.
>  - ***Optional:*** (You can right-click on the instance, go to "Monitor and troubleshoot", and then select "Get system log" to view its contents. If the log is still completely black, it is recommended to wait a little longer.)
4. Right-click on the instance and select "Stop Instance".
5. Right-click on the instance after it's in the "Stopped" state, and select "Create Image" from the "Image and templates" menu.
6. Enter the Image name and then click the Create Image button.


## B. Load setup image, start the application with a script
7. Refer to [steps 0-2,4-7](https://github.com/bazmurphy/node-visitor-count/blob/main/README.md) on Baz's Readme, with the exception of step 3 which must be replaced with the following steps
  - Application and OS Images (Amazon Machine Image)-> Click "My AMIs"-> choose your created Image
![Screenshot 2023-04-20 at 21 52 57](https://user-images.githubusercontent.com/107769663/233485434-856ed87c-8733-4f0f-a5a5-20ab73f0fbf3.png)
8. User Data - Enter user data in the field.
```bash
#!/bin/bash
git clone <github url> /home/ubuntu/<empty folder name>
cd /home/ubuntu/<empty folder name>
npm i
pm2 start /home/ubuntu<empty folder name>/<Name of the Node.js executable file>
pm2 save
pm2 startup systemd
```
![User Data](https://user-images.githubusercontent.com/107769663/233487978-752f53d1-1933-45d4-b2b2-066dba60bd51.png)

9. Click on "Launch Instance", and wait for about 10 minutes for the instance to execute the user data command.
>  - ***Optional:*** (You can refer to [step 9](https://github.com/bazmurphy/node-visitor-count/blob/main/README.md) if you want to know whether the deployment was successful.)


## C. Using Nginx as a reverse proxy server allows the application to use port 80 (HTTP).
10. Connect to the instance mentioned above B.(step 7 - 9)
11. `sudo apt-get update`
12. `sudo apt-get install nginx` -> 'Yes'
>  - ***Optional:*** `sudo systemctl status nginx`(Check if it is active)
>  - ![](https://user-images.githubusercontent.com/107769663/233511361-82c5b41b-d598-486f-8baa-83cd11fcbd21.png)
13. `sudo nano /etc/nginx/conf.d/server.conf`

>(The file name 'server' can be changed to something else, such as xxx.conf or react.conf)

Use nano to edit the Nginx configuration file. This file defines the settings for the Nginx server, such as which port to listen on, which root directory to use, and so on. After making changes to the configuration file, you need to reload Nginx to make the changes take effect.

```
server {
    listen 80;
    server_name <your public ip>;

    location / {
        proxy_pass http://localhost:<your app port>;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
![](https://user-images.githubusercontent.com/107769663/233511933-46b01b6a-27a7-44ff-8a73-a10f60e90537.png)

>  - ***Optional:*** `sudo nginx -t`(To test if the Nginx configuration file contains any errors. It does not actually start Nginx but only checks if the configuration file is correct.)
>  - ![](https://user-images.githubusercontent.com/107769663/233511274-4cc28ae1-f6c6-4d4d-a98b-9c46a5fb4b13.png)
14. `sudo service nginx reload`(To reload Nginx to make the changes take effect.)
15. Finish

https://user-images.githubusercontent.com/107769663/233510722-67469c47-49c9-49fa-a67e-dab9e1f4ae20.mov
