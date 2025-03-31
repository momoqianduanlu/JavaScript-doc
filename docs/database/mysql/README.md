# mysql数据库安装到实战

~~~mysql
# 连接mysql命令
登录用户名 mysql -u<username> -p<password> -h<hostname> <databasename>

# 关系型数据库一共有四个单位
库、表、行、列

1. 一条数据的存储规过程(DDL)
	在mysql中，一个完整的数据存储过程共有四步，分别为：（创建库）-（定字段）-（创建表）-（插数据），前三步称为ddl。
	
2. 数据库定义语句介绍
    CREATE DATABASE 用于创建库 表 索引 视图等；
    ALTER DATABASE 用于修改库的名称，字符集，排序规则等；
    DROP DATABASE 用于删除库，如删除表，删除索引等；
    
3. SQL命名规定和规范
	数据库名，表名不能超过30个字符，变量名限制为29个字符；
	表名：表名由字母、数字、下划线、@、#、$、%、_组成，并且不能以数字开头，表名区分大小写。
  字段：字段名由字母、数字、下划线、@、#、$、%、_组成，并且不能以数字开头，字段名区分大小写。
	数据库名、表名、字段名之间不能包含空格，
	同一个mysql软件中，数据库不能重名，同一个库，表名不能重名，同一个表中，字段不能重复，
	
4. 标识符命名规范
	注释应该清晰，简洁的解释SQL语句的意图，功能和影响，
	库 表 列名应该使用小写字母，并使用_或驼峰，
	库 表 字段名应该简洁明了，具有描述性，反应器所存储数据的含义，
	表名最好是遵循业务名称_表的作用，例如：alipay_task，order_detail_table
	列名最好是遵循表实体_属性的作用，例如：customer_id，product_name
~~~

## 数据库定义语句（DDL）

数据定义语言（Data Definition Language）。
`DDL` 用于定义和管理数据库的结构，包括 `库、表、索引、视图` 等数据库对象的 `创建`、`修改` 和 `删除`。
`DDL` 不涉及对数据的操作，而是关注数据库的结构和元数据（容器）。

### 数据库创建

1. 创建库

   `CREATE DATABASE 数据库名；`

2. 判断再创建库

   `CREATE DATABASE IF NOT EXISTS 数据库名；`

3. 创建数据库并指定字符集

    `CREATE DATABASE 数据库名称 CHARACTER SET utf8;`

4. 创建数据库并指定排序规则

   `CREATE DATABASE 数据库名称 COLLATE utf8_general_ci;`

5. 创建数据库并指定字符集和排序规则

   `create database 数据库名称 character set utf8 collate utf8mb4_0900_as_cs;`

  练习：创建ddl_dl库，指定字符集为utf-8，且排序方式用大小敏感的utf8mb4_0900_as_cs模式

  `CREATE DATABASE IF NOT EXISTS ddl_dl CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;`

#### 常见字符集（Character Set）

utf8：早期版本的字符集，最多3字节存储一个字符，3字节无法覆盖全部unicode编码，有显示乱码的可能。
utfmb4（8+默认）：解决utf8的存储限制，使用4字节进行字符存储，可以覆盖更广 Unicode 编码，包括表情符号等等。

#### 常见排序规则（Collate）

utf8mb4_0900_ai_ci：UTF-8 的不区分大小写的排序规则((mysql8+的默认排序规则)。
utf8mb4_0900_as_cs：UTF-8 的 Unicode 排序规则，区分大小写！。

> 字符集就是我们常说的编码格式，决定了数据如何编码存储！
> 排序规则决定了如何比较和排序存储在数据库中的文本数据。

### 数据库查看

1. 查看所有库

   `SHOW DATABASES;`

2. 查看当前使用库

   `SELECT DATABASE();`

3. 查看库下所有表

   `SHOW TABLES FROM 数据库名;`

4. 查看创建库的信息和语句

   `SHOW CREATE DATABASE 数据库名;`

5. 查看数据库的字符集

   `SHOW VARIABLES LIKE '数据库名称';`

6. 查看数据库的排序规则

   `SHOW VARIABLES LIKE '数据库名称';`

7. 选中和切换库

   `USE 数据库名;`

### 数据库修改

1. 修改字符集

   `ALTER DATABASE 数据库名 CHARACTER SET utf8mb4;`

2. 修改排序规则

   `ALTER DATABASE 数据库名 COLLATE utf8mb4_0900_as_cs`;

3. 修改字符集和排序方式

   `ALTER DATABASE 数据库名 CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;`

  注意：数据库中没有修改名字的指令，如果你想修改名字，备份数据，删除旧库，创建新库，恢复数据即可；

### 数据库删除

1. 直接删除库

   `DROP DATABASE 数据库名;`

2. 判断删除库

   `DROP DATABASE IF EXISTS 数据库名;`

  注意：删除库之前需要备份数据，并做好数据恢复的准备，删除库后，所有表，索引，视图等都将消失；

## 表的操作

### 表管理：创建表

~~~mysql
CREATE TABLE posts ( 
     post_id INT AUTO_INCREMENT PRIMARY KEY, 
     title VARCHAR(255) NOT NULL COMMENT 'The title of the blog post’, 
     content TEXT NOT NULL COMMENT 'The content of the blog post’, 
     author_id INT NOT NULL COMMENT 'The ID of the author of the post’, 
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'The timestamp when the post was created’, 
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES authors(author_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'Table storing blog posts'; 

~~~

~~~mysql
CREATE TABLE [IF NOT EXISTS]  表名 ( 
     列名 类型 [列可选约束], 
     列名 类型 [列可选约束]  [COMMENT ‘列可选注释’], 
     列名 类型 [列可选约束]  [COMMENT ‘列可选注释’],
     列名 类型 [列可选约束]  [COMMENT ‘列可选注释’], 
     列名 类型 [列可选约束]  [COMMENT ‘列可选注释’],  # 列之间使用 , 分割
    [列可选约束]                                   # 最后一列省略 , 如果加上会报错
) [表可选约束] [COMMENT ‘表可选注释’];
~~~

> 关键点1：表名、列名、类型必须填写，其他可选
>
> 关键点2：推荐使用if not exists，直接创建存在报错
>
> 关键点3：列之间使用 ,  进行分割
>
> 关键点4：注释不是必须的，但是是很有必要的

### 表管理

#### 数据类型（整数）

MySQL支持多种数据类型，包括 `整数`、`浮点数`、`定点数`、`字符串`、`日期 时间`等；

https://dev.mysql.com/doc/refman/8.0/en/data-types.html；

1. 标准sql，MySQL支持SQL标准整数类型 `INTEGER （或 INT ）`和 `SMALLINT `。
2. MySQL 还支持整数类型 `TINYINT` 、` MEDIUMINT` 和 `BIGINT` 。

| 类型    | 存储(字节) | 最小值有符号 | 最小值无符号 | 最大值有符号 | 最大值无符号 |
| ------- | ---------- | ------------ | ------------ | ------------ | ------------ |
| TINYINT |            |              |              |              |              |
|         |            |              |              |              |              |
|         |            |              |              |              |              |
|         |            |              |              |              |              |
|         |            |              |              |              |              |

> 注意：无符号==无负号，整数类型都可以添加 `unsigned` 修饰符，添加以后对应列数据变成无负号类型，值从0开始！！
>
> `unsigned` 必须紧贴类型后放置

**有符号**：列名（整数类型）=》有符号 | 有负号，有负值和正值。

​					列名（整数类型）=》无符号 | 无负号，没有负值，都是正值，将负值部分绝对值后，加入正值部分。

#### 数据类型（浮点数）

`FLOAT` 和 `DOUBLE` 类型表示近似的数值数据值。MySQL 使用 `4` 个字节表示单精度值，使用 `8` 个字节表示双精度值。下表显示了每种类型所需的存储和范围。

|    类型     | 存储（字节） | M（小数+整数位数） | D（小数点后几位数） |
| :---------: | :----------: | :----------------: | :-----------------: |
| FLOAT(M,D)  |      4       |     M最大为24      |      D最大为8       |
| DOUBLE(M,D) |      8       |     M最大为53      |      D最大为30      |

~~~mysql
stu_height float(4,1)  unsigned COMMENT ‘身高，保留一位小数，多位会四舍五入’, 
~~~

#### 数据类型（定点数）

`DECIMAL` 类型存储精确的数值数据值。当需要保持精确精度时，例如货币数据，商品价格等等！

|     类型     | 存储（字节） | M（小数+整数位数） | D（小数点后几位数） |
| :----------: | :----------: | :----------------: | :-----------------: |
| DECIMAL(M,D) |   动态计算   |     M最大为65      |      D最大为30      |

> 注意：`DECIMAL` 类型的存储空间是可变的，它的存储大小受 `DECIMAL` 数据类型定义时指定的精度和规模影响。
> 如果D小数位数为 0， `DECIMAL` 则值不包含小数点或小数部分。

~~~mysql
emp_salary DECIMAL(8,1) COMMENT ‘工资，保留一位小数，多位会四舍五入’, 
~~~

#### 数据类型（字符串）

`CHAR` 和 `VARCHAR` 类型都可以存储比较短的字符串

| 字符串(文本) |   特点   | 长度 |      长度范围（字符）      |         存储空间          |
| :----------: | :------: | :--: | :------------------------: | :-----------------------: |
|   CHAR(M)    | 固定长度 |  M   |       0 <= M <= 255        |   M*4个字节（utf8mb4）    |
|  VARCHAR(M)  | 可变长度 |  M   | MySql一行数据最多65535字节 | (M*4+1) 个字节（utf8mb4） |

> `CHAR(M)` 类型一般需要预先定义字符串长度。如果不指定(M)，则表示长度默认是 `1` 个字符。
> 保存数据的实际长度比 `CHAR` 类型声明的长度小，则会在右侧填充空格以达到指定的长度。
> 当MySQL检索CHAR类型的数据时，CHAR类型的字段会去除尾部的空格。
>
> 性能较好，

> `VARCHAR(M)` 定义时，必须指定长度 `M`，否则报错。
> MySQL4.0版本以下，varchar(20)：指的是20字节，如果存放UTF8汉字时，只能存6个（每个汉字3字节）；
> MySQL5.0版本以上，varchar(20)：指的是20字符，检索VARCHAR类型的字段数据时，会保留数据尾部的空格。
>
> 性能一般，

通过显示将各种字符串值存储到 CHAR(4) and VARCHAR(4) 列的结果

| 插入值 | CHAR(4) | 所需存储 | VARCHAR(4) | 所需存储 |
| :----: | :-----: | :------: | :--------: | :------: |
|   ''   | '    '  | 4 bytes  |     ''     | 1 bytes  |
|  'ab'  | 'ab  '  | 4 bytes  |    'ab'    | 3 bytes  |
| 'abcd' | 'abcd'  | 4 bytes  |   'abcd'   | 5 bytes  |

##### 讨论（M）

~~~mysql
CREATE TABLE 表名 (  
    post_name  VARCHAR(16384) NOT NULL  
) ENGINE=INNODB CHARSET=utf8mb4;

错误代码： 1074
Column length too big for column 'post_name' (max = 16383); use BLOB or TEXT instead

~~~

在MySQL的设定中，单行数据最大能存储 `65535` 字节数据**（注意：是一行非额外存储所有列总和且单位是字节）**

字符集为 `utf8mb4`，**每个字符占4个字节，**字符串列需要1个额外字节空间记录是否为空。

计算 `（65535-1）/ 4 = 16383.5`  向下取余 16383，单列 `utf8mb4` 字符集类型最大字符限制 `16383`。

~~~mysql
CREATE TABLE 表名 (  
    post_name  VARCHAR(16000) NOT NULL, 
    post_name2  VARCHAR(384) NOT NULL  
) ENGINE=INNODB CHARSET=utf8mb4;

错误代码： 1118
Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs
~~~

在MySQL的设定中，单行数据最大能存储 `65535 ` 字节数据，但是 `TEXT` 和 `BLOB` 类型不计算，他们属于额外存储！
这种场景可以使用 `TEXT` 进行某列类型替换即可！

##### 数据类型（文本类型）

在MySQL中，`TEXT` 用来保存文本类型的字符串，总共包含4种类型，分别为`TINYTEXT`、`TEXT`、`MEDIUMTEXT `和 `LONGTEXT` 类型。
在向 `TEXT` 类型的字段保存和查询数据时，系统自动按照实际长度存储，不需要预先定义长度。这一点和 `VARCHAR` 类型相同。

| 文本字符串类型 |        特点        | 长度(字符) |  存储范围（字节）   |    占用的存储空间    |
| :------------: | :----------------: | :--------: | :-----------------: | :------------------: |
|    TINYTEXT    |  小文本、可变长度  |     L      |    0 <= x <= 255    |     L + 2 个字节     |
|      TEXT      |   文本、可变长度   |     L      |   0 <= x <= 65535   |     L + 2 个字节     |
|   MEDIUMTEXT   | 中等文本、可变长度 |     L      | 0 <= x <= 16777215  |     L + 3 个字节     |
|    LONGTEXT    |  大文本、可变长度  |     L      | 0 <= x<= 4294967295 | L + 4 个字节(最大4g) |

~~~mysql
CREATE TABLE 表名(
      tx TEXT
);
~~~

> 短文本，固定长度使用char         例如：性别，手机号
> 短文本，非固定长度使用varchar 例如：姓名，地址
> 大文本，建议存储到文本文件，使用varchar记录文件地址，不使用TEXT，直接存储大文本，他性能非常较差！

#### 数据类型（时间类型）

用于表示时态值的日期和时间数据类型为 `DATE` 、`TIME`、`DATETIME`、`TIMESTAMP` 和 `YEAR` 。每种类型都有一个有效值范围，换一种思路，可以理解时间类型就是`特殊格式的字符串`

| **类型**  | **名称** | **字节** | **日期格式**        | **小值**            | **最大值**          |
| --------- | -------- | -------- | ------------------- | ------------------- | ------------------- |
| YEAR      | 年       | 1        | YYYY或YY            | 1901                | 2155                |
| TIME      | 时间     | 3        | HH:MM:SS            | -838:59:59          | 838:59:59           |
| DATE      | 日期     | 3        | YYYY-MM-DD          | 1000-01-01          | 9999-12-03          |
| DATETIME  | 日期时间 | 8        | YYYY-MM-DD HH:MM:SS | 1000-01-01 00:00:00 | 9999-12-31 23:59:59 |
| TIMESTAMP | 日期时间 | 4        | YYYY-MM-DD HH:MM:SS | 1970-01-01 00:00:00 | 2038-01-19 03:14:07 |

`year` 类型赋 `00-99` 值对应年限，`[00-69]` 对应 `[2000-2069]` ，`[70-99]` 对应 `[1970-1999]`，建议四位年值！

默认情况下，时间需要主动赋予默认值和修改值！

> DATETIME和TIMESTAMP类型自动初始化和更新

~~~mysql
# 方式1： 插入默认当前时间和修改自动更新当前时间
TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
# 方式2： 插入默认当前时间
TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
DATETIME DEFAULT CURRENT_TIMESTAMP
~~~

### 表管理：修改表

#### 修改表中列（字段）

1. 修改表，添加一列[可以指定X字段前或者后]
   `ALTER TABLE 表名 ADD  字段名 字段类型 【FIRST|AFTER 字段名】`；

2. 修改表，修改列名
   `ALTER TABLE 表名 CHANGE  原字段名 字段名  新字段类型 【FIRST|AFTER 字段名】`;

3. 修改表，修改列类型
   `ALTER TABLE 表名 MODIFY  字段名  新字段类型 【FIRST|AFTER 字段名】`;

4. 修改表，删除一列

   `ALTER TABLE 表名 DROP  字段名` ;

#### 修改表名

1. 修改表名
   `ALTER TABLE 表名 RENAME  [TO]  新表名`;

~~~mysql
/**
要求1：创建表格employees
要求2：将表employees的mobile字段修改到code字段后面。
要求3：将表employees的birth字段改名为birthday;
要求4：修改sex字段，数据类型为char（1）。
要求5：删除字段note；
要求6：增加字段名favoriate_activity，数据类型为varchar（100）；
要求7：将表employees的名称修改为 employees_info
*/

# 要求2：将表employees的mobile字段修改到code字段后面
ALTER TABLE employees MODIFY mobile VARCHAR(25) AFTER `code`;
# 要求3：将表employees的birth字段改名为birthday;
ALTER TABLE employees CHANGE birth birthday DATE;
# 修改sex字段，数据类型为char（2）;
ALTER TABLE employees MODIFY sex CHAR(2);
# 要求5：删除字段note；
ALTER TABLE employees DROP note;
# 要求6：增加字段名favoriate_activity，数据类型为varchar（100）；
ALTER TABLE employees ADD favorite_activity VARCHAR(100);
# 要求7：将表employees的名称修改为 employees_info
ALTER TABLE employees RENAME employees_info;
~~~



### 表管理：删除表

#### 删除表

`DROP TABLE [IF EXISTS] 数据表1 [, 数据表2, …, 数据表n]`;

#### 清空表数据

`TRUNCATE TABLE 表名`;   删除表中的数据和表的关联记录;

> 删除表和清空表数据命令都是无法回滚的！动作不可以，执行之前需三思！

## 数据操纵语句（DML）

数据操作语句（Data Manipulation Language），`DML` 用于数据库 **数据** `插入`、`删除`、`更新` 三种操作，

`DML` 不影响库表结构，但是会真正影响数据库数据。

**数据操作的最基本单位是`行`，按行进行增删改！**

### 插入数据语法

1. 为表的一行**所有**字段（列）插入数据

   `INSERT INTO 表名  VALUES (value1,value2,....);`

   值列表中需要为表的每一个字段指定值，并且值的顺序必须和数据表中字段定义时的顺序相同。

2. 为表的一行**指定**字段（列）插入数据(推荐)

   `INSERT INTO 表名(列名1,列名2.....） VALUES (value1,value2,....);`

   值列表中需要为表名后指定的列指定值，并且值的顺序和类型必须和指定的列顺序相同。

3. 同时插入**多条**记录

   `INSERT INTO 表名 VALUES (value1,value2,....) ,...., (value1,value2,....);
   或者
   INSERT INTO 表名(列名1,列名2.....) VALUES (value1,value2,....) ,...., (value1,value2,....);`

   情况1、情况2都可以转成一次插入多表数据，只需要在values后面写多个(值1,值2…)即可，`()` 代表一行。

> `VALUES` 也可以写成 `VALUE`，但是 `VALUES` 是标准写法，
>
> `字符` 和 `日期` 型数据应包含在单引号中。

~~~mysql
CREATE TABLE students(
	stu_id INT,
	stu_name VARCHAR(30),
	stu_age TINYINT UNSIGNED COMMENT '年龄',
	stu_birthday DATE,
	stu_height DECIMAL(4,1) DEFAULT 200 COMMENT '身高'
)

# 1.插入一名学生的所有信息，包括学号、名字、年龄、生日和身高。
INSERT INTO students VALUES (1, '小明', 18, '2024-12-24', 175);
# 2.插入一名学生的学号、名字、年龄，其他列使用默认值。
INSERT INTO students (stu_id, stu_name, stu_age) VALUES (2, '小黑', 18);
# 3.插入两名学生的信息，包括学号、名字、年龄、生日和身高。
INSERT INTO students VALUES (3, 'a', 18, '2024-12-24', 185),(5, 'b', 18, '2024-12-24', 186);
# 4.插入一名学生的信息，只提供学号、名字和年龄，其他列为空值。
INSERT INTO students (stu_id, stu_name, stu_age, stu_birthday, stu_height) VALUES (6, 'aaa', 18, NULL, NULL);
~~~

### 修改数据语法

1. 修改表中所有行数据（全表修改）

   ~~~mysql
   UPDATE table_name
   SET column1=value1, column2=value2, … , column=valuen
   ~~~

   更新表中所有行的指定列数据。

2. 修改表中符合条件行的数据（条件修改）

   ~~~mysql
   UPDATE table_name
   SET column1=value1, column2=value2, … , column=valuen
   [WHERE condition]
   ~~~

   条件修改只是在后面添加 `where`，`where` 后面指定相关的条件即可。

   ~~~mysql
   # 1.准备新的数据
   INSERT INTO students (stu_id, stu_name, stu_age, stu_birthday, stu_height)
   VALUES
       (6, '张三', 21, '2002-05-10', 175.5),
       (7, '李四', 20, '2003-02-15', 168.0),
       (8, '王五', 22, '2001-09-20', 180.2),
       (9, '赵六', 19, '2004-03-08', 165.8),
       (10, '钱七', 23, '2000-12-01', 172.3),
       (11, '孙八', 20, '2003-06-25', 160.5),
       (12, '周九', 21, '2002-11-18', 175.0),
       (13, '吴十', 22, '2001-04-30', 168.7),
       (14, '郑十一', 19, '2004-08-12', 185.5),
       (15, '王十二', 23, '2000-07-05', 170.1);
   		
   		
   # 2.将学号为8的学生的姓名改为'黄六'。
   UPDATE students SET stu_name='黄六' WHERE stu_id=8;
   # 3.将年龄小于20岁的学生的身高增加2.0。(可以使用原列进行运算)
   UPDATE students SET stu_height = stu_height + 2 WHERE stu_age < 20;
   # 4.将学号为11的学生的生日修改为'2003-07-10',且年龄改成21。
   UPDATE students SET stu_birthday='2003-07-10', stu_age=21 WHERE stu_id=11;
   # 5.将所有学生的年龄减少1岁。
   UPDATE students SET stu_age = stu_age - 1;
   ~~~

### 删除数据语法

1. 删除表中所有行数据（全表删除）

   ~~~mysql
   DELETE FROM table_name;
   ~~~

2. 删除表中符合条件行的数据（条件删除）

   ~~~mysql
   DELETE FROM  table_name [WHERE condition]
   ~~~

   ~~~mysql
   # 1.将年龄大于22的学员移除。
   DELETE FROM students WHERE stu_age > 22;
   # 2.将身高高于200且学号大于10的数据移除 (关机操作符 AND)
   DELETE FROM students WHERE stu_height > 200 AND stu_id > 10;
   ~~~

   **逻辑运算符**‌：用于组合多个条件表达式，需注意的是优先级：括号>NOT>AND>OR，

   - AND运算符：用于连接两个或多个条件，所有条件都必须为真时，整个表达式才为真。
   - OR运算符：用于连接两个或多个条件，只要其中任一条件为真，整个表达式即为真。
   - NOT运算符：用于否定其后的条件表达式

## 数据查询语句-单表（DQL）

数据查询语句（Data Query Language）。
`DQL` 用于查询数据库数据操作。
`DQL` 不影响库表结构，也不会影响原表的数据。
`DQL` 会基于原表数据查询出一个虚拟表。

### 非表查询

~~~mysql
SELECT  1；
SELECT 9/2;
SELECT VERSION();
~~~

类似Java控制台输出，直接输出结果。

### 指定表

~~~mysql
SELECT  列名1, 列名2, 列名3  FROM  表名；
或者
SELECT 表名.列名 , 表名.*  FROM 表名；
~~~

指定表，查询表中的全部或者某些列。
列和列之间使用[ , ] 分割，如果是全部列可以使用 `*` 替代。

### 查询列起别名

~~~mysql
SELECT  列名1 as 别名, 列名2, 列名3  as 别名 FROM  表名；
或者
SELECT  列名1 别名, 列名2, 列名3 别名 FROM  表名；
~~~

查询列可以起别名，`as` 可以省略。
起别名的意义主要是简化列名或者对应后期Java数据属性等
如果别名想要区分大小写，可以添加双引号  例如：”Name”

### 去除重复行

~~~mysql
SELECT  DISTINCT 列名 [,列名,列名]  FROM 表名;
~~~

指定列值去重复行，可以指定单列或者多列，但是 `DISTINCT` 关键字只写一次且在前面。

### 查询常数

~~~mysql
SELECT ‘尚硅谷’ as corporation , 列名 , 列名… FROM 表名;
~~~

SELECT 查询还可以对常数进行查询。就是在 SELECT 查询结果中增加固定的常数列。
这列的取值是我们指定的，而不是从数据表中动态取出的。

### 基础SELECT练习

~~~mysql
CREATE TABLE `t_employee` (
  `eid` INT NOT NULL COMMENT '员工编号',
  `ename` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '员工姓名',
  `salary` DOUBLE NOT NULL COMMENT '薪资',
  `commission_pct` DECIMAL(3,2) DEFAULT NULL COMMENT '奖金比例',
  `birthday` DATE NOT NULL COMMENT '出生日期',
  `gender` ENUM('男','女') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '男' COMMENT '性别',
  `tel` CHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '手机号码',
  `email` VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `address` VARCHAR(150) DEFAULT NULL COMMENT '地址',
  `work_place` SET('北京','深圳','上海','武汉') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '北京' COMMENT '工作地点'
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT  INTO `t_employee`(`eid`,`ename`,`salary`,`commission_pct`,`birthday`,`gender`,`tel`,`email`,`address`,`work_place`) 
VALUES (1,'孙洪亮',28000,'0.65','1980-10-08','男','13789098765','shl@atguigu.com','白庙村西街','北京,深圳'),
(2,'何进',7001,'0.10','1984-08-03','男','13456732145','hj@atguigu.com','半截塔存','深圳,上海'),
(3,'邓超远',8000,NULL,'1985-04-09','男','18678973456','dcy666@atguigu.com','宏福苑','北京,深圳,上海,武汉'),
(4,'黄熙萌',9456,NULL,'1986-09-07','女','13609876789','hxm@atguigu.com','白庙村东街','深圳,上海,武汉'),
(5,'陈浩',8567,NULL,'1978-08-02','男','13409876545','ch888@atguigu.com','回龙观','北京,深圳,上海'),
(6,'韩庚年',12000,NULL,'1985-04-03','男','18945678986','hgn@atguigu.com','龙泽','深圳,上海'),
(7,'贾宝玉',15700,'0.24','1982-08-02','男','15490876789','jby@atguigu.com','霍营','北京,武汉'),
(8,'李晨熙',9000,'0.40','1983-03-02','女','13587689098','lc@atguigu.com','东三旗','深圳,上海,武汉'),
(9,'李易峰',7897,NULL,'1984-09-01','男','13467676789','lyf@atguigu.com','西山旗','武汉'),
(10,'陆风',8789,NULL,'1989-04-02','男','13689876789','lf@atguigu.com','天通苑一区','北京'),
(11,'黄冰茹',15678,NULL,'1983-05-07','女','13787876565','hbr@atguigu.com','立水桥','深圳'),
(12,'孙红梅',9000,NULL,'1986-04-02','女','13576234554','shm@atguigu.com','立城苑','上海'),
(13,'李冰冰',18760,NULL,'1987-04-09','女','13790909887','lbb@atguigu.com','王府温馨公寓','北京'),
(14,'谢吉娜',18978,'0.25','1990-01-01','女','13234543245','xjn@atguigu.com','园中园','上海,武汉'),
(15,'董吉祥',8978,NULL,'1987-05-05','男','13876544333','djx@atguigu.com','小辛庄','北京,上海'),
(16,'彭超越',9878,NULL,'1988-03-06','男','18264578930','pcy@atguigu.com','西二旗','深圳,武汉'),
(17,'李诗雨',9000,NULL,'1990-08-09','女','18567899098','lsy@atguigu.com','清河','北京,深圳,武汉'),
(18,'舒淇格',16788,'0.10','1978-09-04','女','18654565634','sqg@atguigu.com','名流花园','北京,深圳,武汉'),
(19,'周旭飞',7876,NULL,'1988-06-13','女','13589893434','sxf@atguigu.com','小汤山','北京,深圳'),
(20,'章嘉怡',15099,'0.10','1989-12-11','女','15634238979','zjy@atguigu.com','望都家园','北京'),
(21,'白露',9787,NULL,'1989-09-04','女','18909876789','bl@atguigu.com','西湖新村','上海'),
(22,'刘烨',13099,'0.32','1990-11-09','男','18890980989','ly@atguigu.com','多彩公寓','北京,上海'),
(23,'陈纲',13090,NULL,'1990-02-04','男','18712345632','cg@atguigu.com','天通苑二区','深圳'),
(24,'吉日格勒',10289,NULL,'1990-04-01','男','17290876543','jrgl@163.com','北苑','北京'),
(25,'额日古那',9087,NULL,'1989-08-01','女','18709675645','ergn@atguigu.com','望京','北京,上海'),
(26,'李红',5000,NULL,'1995-02-15','女','15985759663','lihong@atguigu.com','冠雅苑','北京'),
(27,'周洲',8000,NULL,'1990-01-01','男','13574528569','zhouzhou@atguigu.com','冠华苑','北京,深圳');


# 1. 查询所有员工信息
SELECT * FROM t_employee;
# 2. 查询所有员工信息，并且添加一列 etype,值固定为`总部`, * 通配符必须放在第一位
SELECT *, '总部' as etype FROM t_employee;
# 3. 查询所有员工姓名和工资以及工作地址
SELECT ename, salary, address FROM t_employee;
# 5. 查询所有员工姓名和工资名字显示为name
SELECT ename AS name, salary FROM t_employee;
# 6. 查询所有员的性别种类
SELECT DISTINCT gender FROM t_employee;
# 4. 查询所有员工姓名，月薪和年薪（年薪等于月薪*12,结果列字段为 姓名 , 月薪 ， 年薪 ）
SELECT ename 姓名, salary 月薪, salary*12 AS 年薪 FROM t_employee;
# 5. 查询所有员工姓名，月薪，每月奖金，每月总收入（结果列字段为 姓名 , 月薪 ， 奖金，月总 ）
SELECT ename 姓名, salary 月薪, salary * commission_pct AS 奖金, salary + salary * commission_pct AS 总收入 FROM t_employee;
# 因为有些员工没有奖金，奖金占比就是null，但是 null与任何值做运算都是null，IFNULL(列名, 传入的默认值)
SELECT ename 姓名, salary 月薪, salary * IFNULL(commission_pct,0) AS 奖金, salary + salary * IFNULL(commission_pct,0) AS 总收入 FROM t_employee;
# 6. 查询所有员工一共有几种薪资
SELECT DISTINCT salary FROM t_employee;
~~~

### 显示表结构

~~~mysql
DESCRIBE employees;
或
DESC employees;
~~~

> 其中，各个字段的含义分别解释如下：
>     Field：表示字段名称。 
>     Type：表示字段类型。
>     Null：表示该列是否可以存储NULL值。
>     Key：表示该列是否已编制索引。
>             PRI表示该列是表主键的一部分；
>             UNI表示该列是UNIQUE索引的一部分；
>             MUL表示在列中某个给定值允许出现多次。
>     Default：表示该列是否有默认值，如果有，那么值是多少。
>     Extra：表示可以获取的与给定列有关的附加信息，例如AUTO_INCREMENT

### 过滤数据(条件查询)

1. 非全表，添加过滤条件

   ~~~mysql
   SELECT 字段1,字段2 FROM 表名 WHERE 过滤条件;
   ~~~

   `where` 添加以后，就不是全表查询，先过滤条件，符合，再返回指定列。

2. 基础select练习

   ~~~mysql
   # 1. 查询员工表结构，并分析
   DESC t_employee;
   # 2. 查询工资高于9000的员工信息
   SELECT * FROM t_employee WHERE salary > 9000;
   # 3. 查询年薪高于200000的员工 姓名，薪资和年薪信息
   SELECT ename, salary, salary*12 AS 年薪 FROM t_employee WHERE salary > 20000;
   # 4. 查询工资高于8000且性别为女的员工信息
   SELECT * FROM t_employee WHERE salary > 8000 AND gender = '女';
   ~~~

   

### 运算符使用

#### 算数运算符

算术运算符主要用于数学运算，其可以连接运算符前后的两个数值或表达式，对数值或表达式进行

`加（+）`、

`减（-）`、

`乘（*）`、

`除（/）`、

 `取模（%）`

| 运算符  | 描述       |
| ------- | ---------- |
| %， MOD | 模运算符   |
| *       | 乘法运算符 |
| +       | 加法运算符 |
| -       | 减号运算符 |
| /       | 浮点除法   |
| DIV     | 整数除法   |

> 运算表达式可以应用在 select列位置或者where条件后！

1. 基本的加减乘除使用

   ~~~mysql
   SELECT 100, 100 + 0, 100 - 0, 100 + 50, 100 + 50 -30, 100 + 35.5, 100 - 35.5 ,
          3*5, 3*5.0, 3/5 , 100/0,5 DIV 2, -5 DIV 2 , 100 /(1-1);
   
   结果-> 100, 100, 100, 150, 120, 135.5 ,64.5, 15, 15.0, 0.6 , null , 2 , -2 , null
   ~~~

   > 运算符优先级与我们之前学习一致，提高优先级可以使用 `()`，
   > `*` 如果有浮点，会保留浮点类型，参数都是整数结果整数，
   >
   >  `/`，` DIV` 的区别，/ 浮点除法，DIV整除除法，
   >
   > 如果出现除以零的情况，通常会返回 NULL，而不是抛出错，

2. 模运算符号使用

   ~~~mysql
   SELECT  5 % 2 , 5 MOD 2 , -5 % 2 , -5 MOD 2 ;
   结果->1, 1 , -1, -1
   ~~~

~~~mysql
# 1. 查询薪资奖金和大于20000的员工信息
SELECT * FROM t_employee WHERE salary + (IFNULL(commission_pct,0) * salary) > 20000;
# 2. 查询薪资减去奖金的差小于8000的员工信息
SELECT * FROM t_employee WHERE salary - (IFNULL(commission_pct,0) * salary) < 8000;
# 3. 查询员工编号是偶数的员工信息
SELECT * FROM t_employee WHERE eid % 2 = 0;
~~~

#### 比较运算符

| 名字                    | 描述                            |
| ----------------------- | ------------------------------- |
| >                       | 大于运算符                      |
| >=                      | 大于或等于运算符                |
| <                       | 小于操作符号                    |
| <=                      | 小于或等于运算符                |
| <>, !=                  | 不相等的运算符，（!= 非标准）   |
| =                       | 相等运算符                      |
| <=>                     | NULL 安全等于运算符，（非标准） |
| IS NULL                 | NULL 值测试                     |
| IS NOT NULL             | NOT NULL 值测试                 |
| BETWEEN ... AND ...     | 值是否在值范围内                |
| NOT BETWEEN ... AND ... | 值是否不在值范围内              |
| IN()                    | 值是否在一组值中                |
| NOT IN()                | 值是否不在一组值中              |
| LIKE                    | 简单的模式匹配（模糊等于）      |
| NOT LIKE                | 否定简单的模式匹配              |

1. 等于对比

   ~~~mysql
   SELECT 1 = 0; -> 0 
   SELECT '0' = 0; -> 1 
   SELECT '0.0' = 0; -> 1 
   SELECT '.01' = 0.01; -> 1
   SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL; -> 1, 1, 0 
   SELECT 1 <=> 1, NULL IS NULL, 1 IS NULL; -> 1, 1, 0 
   SELECT 1 = 1, NULL = NULL, 1 = NULL; -> 1, NULL, NULL
   ~~~

   > `=` 对比不能做空判断，null = null -> false
   >
   > `<=>` 进行null 在 = 的基础上，添加了null判断，但是他是`方言`，推荐使用 `is null` 或者 `is not null`。

2. 不等于运算使用

   ~~~mysql
   mysql> SELECT '.01' <> '0.01'; -> 1 
   mysql> SELECT .01 <> '0.01'; -> 0 
   mysql> SELECT 'zapp' <> 'zappp'; -> 1
   ~~~

   > 如果双方都是字符串，就按照字符串比较，不会转成数字比较值。

3. 区间运算使用

   ~~~mysql
   # 表达式 expr BETWEEN min AND max
   # 等效于表达式 (min <= expr AND expr <= max) 
   SELECT 2 BETWEEN 1 AND 3, 2 BETWEEN 3 and 1; -> 1, 0 
   SELECT 1 BETWEEN 2 AND 3; -> 0 
   SELECT 'b' BETWEEN 'a' AND 'c'; -> 1 
   SELECT 2 BETWEEN 2 AND '3'; -> 1
   ~~~

   > 字符串就是按照ascii编码排序
   >
   > 固定第一个是min值，第二个是max值，不会自动转化
   >
   > 有字符串和数字，会自动值转化

4. 组范围对比

   ~~~mysql
   # expr IN (value,...)
   mysql> SELECT 2 IN (0,3,5,7); -> 0 
   mysql> SELECT 'wefwf' IN ('wee','wefwf','weg'); -> 1
   mysql> SELECT (3,4) IN ((1,2), (3,4)); -> 1 
   mysql> SELECT (3,4) IN ((1,2), (3,5)); -> 0
   mysql> SELECT ‘a’ NOT IN (‘a’,‘b’,‘c’), 1 NOT IN (2,3); -> 0,1
   ~~~

   > `not in` 用法和 `in` 一样，他只是不等于范围内

5. 简单匹配模式

   `LIKE` 运算符主要用来匹配字符串，通常用于模糊匹配，如果满足条件则返回1，否则返回0。**如果给定的值或者匹配条件为NULL，则返回结果为NULL。**

6. 比较运算符练习

   ~~~mysql
   # 1. 查询员工编号为1的员工信息。
   SELECT * FROM t_employee WHERE eid = '1';
   # 2. 查询薪资大于5000的员工信息。
   SELECT * FROM t_employee WHERE salary > 5000;
   # 3. 查询有奖金的员工信息。
   SELECT * FROM t_employee WHERE commission_pct IS NOT NULL;
   # 4. 查询出生日期在 '1990-01-01' 和 '1995-01-01' 之间的员工信息。
   SELECT * FROM t_employee WHERE birthday BETWEEN '1990-01-01' AND '1995-01-01';
   # 5. 查询性别为女性的员工信息。
   SELECT * FROM t_employee WHERE gender = '女';
   # 6. 查询手机号码以 '138' 开头的员工信息。
   SELECT * FROM t_employee WHERE tel LIKE '138________';
   SELECT * FROM t_employee WHERE tel LIKE '138%';
   # 7. 查询邮箱以 '@company.com' 结尾的员工信息。
   SELECT * FROM t_employee WHERE email LIKE '%@company.com';
   # 8. 查询地址为NULL的员工信息。
   SELECT * FROM t_employee WHERE address IS NULL;
   # 9. 查询工作地点在 '北京'、'上海' 或 '深圳' 的员工信息。
   SELECT * FROM t_employee WHERE work_place IN ('北京', '上海', '深圳');
   # 10. 查询员工姓名以 '张' 开头的员工信息。
   SELECT * FROM t_employee WHERE ename LIKE '张%';
   # 11. 查询出生日期不在 '1980-01-01' 和 '2000-01-01' 之间的员工信息。
   SELECT * FROM t_employee WHERE birthday NOT BETWEEN '1990-01-01' AND '1995-01-01';
   # 12. 查询性别不是'男'的员工信息。
   SELECT * FROM t_employee WHERE gender <> '男';
   # 13. 查询员工编号为奇数的员工信息。
   SELECT * FROM t_employee WHERE eid%2 = 1;
   ~~~

#### 逻辑运算符

逻辑运算符主要用来判断表达式的真假，在MySQL中，逻辑运算符的返回结果为`1`、`0`或者`NULL`。

| 逻辑运算符 | 描述     |
| ---------- | -------- |
| AND, &&    | 逻辑且   |
| NOT, !     | 否定值   |
| OR, \|\|   | 逻辑或   |
| XOR        | 逻辑异或 |

> MySQL将任何非零，非 NULL 值计算为 TRUE ！

~~~mysql
SELECT * FROM your_table
WHERE condition1 XOR condition2;
~~~

> 这里，`condition1` 和 `condition2` 是任何返回布尔值的表达式。如果 `condition1` 和 `condition2` 一个为真，一个为假，则 `XOR` 表达式的结果为真；如果两者都为真或都为假，则结果为假。

~~~mysql
mysql> SELECT NOT 10; -> 0
mysql> SELECT NOT 0; -> 1
mysql> SELECT 1 AND 1; ->  1
mysql> SELECT 1 AND 0; -> 0
mysql> SELECT 1 OR 1; ->  1
mysql> SELECT 1 OR 0; ->  1
mysql> SELECT 0 OR 0; -> 0
mysql> SELECT 1 XOR 1; -> 0
mysql> SELECT 1 XOR 0; -> 1
mysql> SELECT 1 XOR 1 XOR 1; -> 1
~~~

~~~mysql
# 逻辑运算符
# 1. 查询薪资大于5000并且工作地点为'北京'的员工信息。
SELECT * FROM t_employee WHERE salary > 5000 AND work_place LIKE '%北京%';
# FIND_IN_SET('值', 列名) 查询值是否出现，出现 1 未出现 0;
SELECT * FROM t_employee WHERE salary > 5000 AND FIND_IN_SET('北京', work_place) = 1;
# 2. 查询奖金比例为NULL或者地址为NULL的员工信息。
SELECT * FROM t_employee WHERE commission_pct IS NULL OR address IS NULL;
# 3. 查询出生日期在 '1985-01-01' 之前或者薪资小于4000的员工信息。
SELECT * FROM t_employee WHERE birthday < '1985-01-01' OR salary < 4000;
# 4. 查询性别为'男'并且工作地点不为'上海'的员工信息。
SELECT * FROM t_employee WHERE SEX = '男' AND FIND_IN_SET('上海',work_place) = 0;
# 5. 查询薪资大于6000或者邮箱以 '@gmail.com' 结尾的员工信息。
SELECT * FROM t_employee WHERE salary > 6000 OR email LIKE '%@gmail.com';
# 6. 查询工作地点为'上海'或者薪资小于4500的员工信息。
SELECT * FROM t_employee WHERE salary < 4500 OR FIND_IN_SET('上海',work_place) = 1;
# 7. 查询员工编号为偶数并且地址不为NULL的员工信息。
SELECT * FROM t_employee WHERE eid%2 = 0 AND address IS NOT NULL;
# 8. 查询性别为'女'或者薪资小于等于5500的员工信息。
SELECT * FROM t_employee WHERE gender = '女' OR salary <= 5500;
# 9. 查询薪资大于5000且工作地点为'北京'或者'上海'的员工信息。
SELECT * FROM t_employee WHERE salary > 5000 AND (FIND_IN_SET('北京',work_place) = 1 OR FIND_IN_SET('上海',work_place) = 1);
# 10. 查询邮箱中包含字母'b'并且地址为NULL的员工信息。
SELECT * FROM t_employee WHERE email LIKE '%b%' AND IS NULL;
~~~

#### 运算符优先级

~~~

~~~

### 单行和多行函数

#### 单行函数/数值函数

|        函数         |                             用法                             |
| :-----------------: | :----------------------------------------------------------: |
|       ABS(x)        |                        返回x的绝对值                         |
|       SIGN(X)       |         返回X的符号。正数返回1，负数返回-1，0返回0，         |
|        PI()         |                        返回圆周率的值                        |
| CEIL(x)，CEILING(x) | 返回大于或等于某个值的最小整数（向上取舍，-32.3 => -32，32.3 => 33） |
|      FLOOR(x)       | 返回小于或等于某个值的最大整数（向下取舍，-32.3 => -33，32.3 => 32） |
|  LEAST(e1,e2,e3…)   |                      返回列表中的最小值                      |
| GREATEST(e1,e2,e3…) |                      返回列表中的最大值                      |
|      MOD(x,y)       |                      返回X除以Y后的余数                      |
|       RAND()        |                       返回0~1的随机值                        |
|       RAND(x)       | 返回0~1的随机值，其中x的值用作种子值，相同的X值会产生相同的随机数 |
|      ROUND(x)       | 返回一个对x的值进行四舍五入后，最接近于X的整数（四舍五入35.3=>35， 35.6=>36） |
|     ROUND(x,y)      | 返回一个对x的值进行四舍五入后最接近X的值，并保留到小数点后面Y位 |
|    TRUNCATE(x,y)    |                 返回数字x截断为y位小数的结果                 |

~~~mysql
SELECT ABS(-3), CEIL(2.3), CEIL(-2.3), FLOOR(2.3), FLOOR(-2.3), RAND(), RAND(6), ROUND(2.3), ROUND(2.36,1), TRUNCATE(2.36,1);
# 3, 3, -2, 2, -3, 0.5528135984696575, 0.6563190842571847, 2, 2.4, 2.3
~~~



#### 单行函数/字符串函数

| 函数                              | 用法                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| CHAR_LENGTH(s)                    | 返回字符串s的字符数。作用与CHARACTER_LENGTH(s)相同           |
| LENGTH(s)                         | 返回字符串s的字节数，和字符集有关                            |
| CONCAT(s1,s2,......,sn)           | 连接s1,s2,......,sn为一个字符串                              |
| INSERT(str, idx, len, replacestr) | 将字符串str从第idx位置开始，len个字符长的子串替换为字符串replacestr |
| REPLACE(str, a, b)                | 用字符串b替换字符串str中所有出现的字符串a                    |
| UPPER(s) 或 UCASE(s)              | 将字符串s的所有字母转成大写字母                              |
| LOWER(s) 或LCASE(s)               | 将字符串s的所有字母转成小写字母                              |
| LEFT(str,n)                       | 返回字符串str最左边的n个字符                                 |
| RIGHT(str,n)                      | 返回字符串str最右边的n个字符                                 |
| TRIM(s)                           | 去掉字符串s开始与结尾的空格                                  |
| SUBSTR(s,index,len)               | 返回从字符串s的index位置取len个字符，作用与SUBSTRING(s,n,len)、MID(s,n,len)相同 |
| FIND_IN_SET(s1,s2)                | 返回字符串s1在字符串s2中出现的位置。其中，字符串s2是一个以逗号分隔的字符串 |
| REVERSE(s)                        | 返回s反转后的字符串                                          |
| NULLIF(value1,value2)             | 比较两个字符串，如果value1与value2相等，则返回NULL，否则返回value1 |

#### 单行函数/时间函数

1. #### 单行函数/时间函数

   | 函数                        | 用法                           |
   | --------------------------- | ------------------------------ |
   | CURDATE() ，CURRENT_DATE()  | 返回当前日期，只包含年、月、日 |
   | CURTIME() ， CURRENT_TIME() | 返回当前时间，只包含时、分、秒 |
   | NOW() / SYSDATE()           | 返回当前系统日期和时间         |
   | UTC_DATE()                  | 返回UTC（世界标准时间）日期    |
   | UTC_TIME()                  | 返回UTC（世界标准时间）时间    |

   > UTC即不考虑时区的日期。

   | 函数                                     | 用法                                            |
   | ---------------------------------------- | ----------------------------------------------- |
   | YEAR(date) / MONTH(date) / DAY(date)     | 返回具体的日期值                                |
   | HOUR(time) / MINUTE(time) / SECOND(time) | 返回具体的时间值                                |
   | MONTHNAME(date)                          | 返回月份：January，...                          |
   | DAYNAME(date)                            | 返回星期几：MONDAY，TUESDAY.....SUNDAY          |
   | WEEKDAY(date)                            | 返回周几，注意，周1是0，周2是1，。。。周日是6   |
   | QUARTER(date)                            | 返回日期对应的季度，范围为1～4                  |
   | WEEK(date) ， WEEKOFYEAR(date)           | 返回一年中的第几周                              |
   | DAYOFYEAR(date)                          | 返回日期是一年中的第几天                        |
   | DAYOFMONTH(date)                         | 返回日期位于所在月份的第几天                    |
   | DAYOFWEEK(date)                          | 返回周几，注意：周日是1，周一是2，。。。周六是7 |

   ~~~mysql
   SELECT NOW(), CURDATE(), CURTIME(), UTC_DATE(), UTC_TIME(), YEAR(NOW()), MONTH(NOW()), WEEK(NOW()), WEEKDAY(NOW()), 
   DAYOFWEEK(NOW()), DAY(NOW()), DAYOFMONTH(NOW());
   ~~~

2. #### 单行函数/时间计算函数

   | 函数                                                         | 用法                                                         |
   | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | DATE_ADD(datetime, INTERVAL expr type)，ADDDATE(date,INTERVAL expr type) | 返回与给定日期时间相差INTERVAL时间段的日期时间               |
   | DATE_SUB(date,INTERVAL expr type)，SUBDATE(date,INTERVAL expr type) | 返回与date相差INTERVAL时间间隔的日期                         |
   | ADDTIME(time1,time2)                                         | 返回time1加上time2的时间。当time2为一个数字时，代表的是秒，可以为负数 |
   | SUBTIME(time1,time2)                                         | 返回time1减去time2后的时间。当time2为一个数字时，代表的是秒，可以为负数 |
   | DATEDIFF(date1,date2)                                        | 返回date1 - date2的日期间隔天数                              |
   | TIMEDIFF(time1, time2)                                       | 返回time1 - time2的时间间隔                                  |

   ~~~mysql
   SELECT ADDDATE(NOW(),INTERVAL 1 MONTH), ADDDATE(NOW(),INTERVAL -1 MONTH), ADDTIME('10:10:10', 20), DATEDIFF(CURDATE(), '2024-12-29'), TIMEDIFF('12:00:00', '10:00:00');
   ~~~

3. #### 单行函数/时间格式化函数

   | **函数**              | **用法**                                   |
   | --------------------- | ------------------------------------------ |
   | DATE_FORMAT(date,fmt) | 按照字符串fmt格式化日期date值              |
   | TIME_FORMAT(time,fmt) | 按照字符串fmt格式化时间time值              |
   | STR_TO_DATE(str, fmt) | 按照字符串fmt对str进行解析，解析为一个日期 |

   ~~~mysql
   SELECT DATE_FORMAT(NOW(),'%Y-%m-%d');
   SELECT TIME_FORMAT(NOW(),'%H-%i-%s');
   SELECT STR_TO_DATE('2024年12月29日', '%Y年%m月%d日');
   ~~~

   | `%Y` | 4位数字表示年份                                             | %y       | 表示两位数字表示年份                                        |
   | ---- | ----------------------------------------------------------- | -------- | ----------------------------------------------------------- |
   | %M   | 月名表示月份（January,....）                                | `%m`     | 两位数字表示月份（01,02,03。。。）                          |
   | %b   | 缩写的月名（Jan.，Feb.，....）                              | %c       | 数字表示月份（1,2,3,...）                                   |
   | %D   | 英文后缀表示月中的天数（1st,2nd,3rd,...）                   | `%d`     | 两位数字表示月中的天数(01,02...)                            |
   | %e   | 数字形式表示月中的天数（1,2,3,4,5.....）                    |          |                                                             |
   | `%H` | 两位数字表示小数，24小时制（01,02..）                       | %h和%I   | 两位数字表示小时，12小时制（01,02..）                       |
   | %k   | 数字形式的小时，24小时制(1,2,3)                             | %l       | 数字形式表示小时，12小时制（1,2,3,4....）                   |
   | `%i` | 两位数字表示分钟（00,01,02）                                | `%S和%s` | 两位数字表示秒(00,01,02...)                                 |
   | %W   | 一周中的星期名称（Sunday...）                               | %a       | 一周中的星期缩写（Sun.，Mon.,Tues.，..）                    |
   | %w   | 以数字表示周中的天数(0=Sunday,1=Monday....)                 |          |                                                             |
   | %j   | 以3位数字表示年中的天数(001,002...)                         | %U       | 以数字表示年中的第几周，（1,2,3。。）其中Sunday为周中第一天 |
   | %u   | 以数字表示年中的第几周，（1,2,3。。）其中Monday为周中第一天 |          |                                                             |
   | %T   | 24小时制                                                    | %r       | 12小时制                                                    |
   | %p   | AM或PM                                                      | %%       | 表示%                                                       |

   ~~~mysql
   # 1. 查询今天过生日的员工信息
   # 2024-12-29 -> 12-29
   SELECT * FROM t_employee WHERE DAY(birthday) = DAY(NOW()) AND MONTH(birthday) = MONTH(NOW());
   SELECT * FROM t_employee WHERE DATE_FORMAT(birthday,'%m-%d') = DATE_FORMAT(NOW(), '%m-%d');
   # 2. 查询本月过生日的员工信息
   SELECT * FROM t_employee WHERE MONTH(birthday) = MONTH(NOW());
   # 3. 查询下月过程日的员工信息
   SELECT * FROM t_employee WHERE MONTH(birthday) = MONTH(NOW()) +1;
   SELECT * FROM t_employee WHERE MONTH(birthday) = MONTH(DATE_ADD(NOW(),INTERVAL 1 MONTH));
   # 4. 查询员工姓名，工资，年龄(保留1位小数点)信息
   SELECT ename, salary, ROUND(DATEDIFF(NOW(), birthday) / 365, 1) AS age from t_employee;
   # 5. 查询年龄在25-35之间的员工信息
   SELECT * FROM t_employee WHERE ROUND(DATEDIFF(NOW(), birthday) / 365, 1) BETWEEN 25 AND 35;
   ~~~

   

#### 流程控制函数

流程处理函数可以根据不同的条件，执行不同的处理流程，可以在SQL语句中实现不同的条件选择。MySQL中的流程处理函数主要包括`IF()`、`IFNULL()`和`CASE()`函数

1. IF 函数是一种条件函数，用于在 SQL 查询中执行基本的条件判断。

   ~~~mysql
   IF(condition, true_value, false_value)
   ~~~

   > 当 condition 成立时，返回 true_value，否则返回 false_value。

2. IFNULL函数是 MySQL 中的一个函数，用于处理 NULL 值。

   ~~~mysql
   IFNULL(column, null_value)
   ~~~

   > 当指定列column值为null, 取null_value的值作为结果。

3. CASE 表达式用于实现多条件判断，并根据条件的结果返回不同的值。

   ~~~mysql
   # 格式1
   CASE
       WHEN condition1 THEN result1
       WHEN condition2 THEN result2
       ...
       ELSE default_result
   END  [AS alias_name]
   # 这种形式中，WHEN 子句后面跟着一个条件，而不是一个具体的值。
   
   # 格式2
   CASE expr
       WHEN value1 THEN result1
       WHEN value2 THEN result2
       ...
       ELSE default_result
   END [AS alias_name]
   # 这种形式中，expr 是要比较的表达式或列名，然后逐个与 WHEN 子句中的值进行比较。
   ~~~

   查询语句练习

   ~~~mysql
   # 1. 此查询将根据员工的生日，如果生日1990年之前，则薪资涨幅为当前薪资的 10%，否则为 5%。
   SELECT ename, salary, birthday, IF(YEAR(birthday) > 1990, salary * 1.05, salary * 1.1) AS newSalary FROM t_employee;
   # 2. 查询员工编号和姓名,以及生成一个type列,更具性别显示男员工or女员工。
   SELECT eid, ename, gender, IF(gender = '男', '男员工', '女员工') AS type FROM t_employee;
   # 3. 查询员工的姓名和工资以及奖金数额(奖金额=salary*commission_pct)。
   SELECT ename, salary, salary * IFNULL(salary*commission_pct,0) AS 奖金额度 FROM t_employee;
   # 4. 查询姓名，性别，以及补助金额（补助按照性别基准值*commission_pct），男性基础2000，女性基准3000，其他0，commission_pct为null算0.1比例!
   SELECT ename, gender, commission_pct,
   	CASE
   		WHEN gender = '男' THEN 2000 * IFNULL(commission_pct,0.1)
   		WHEN gender = '女' THEN 3000 * IFNULL(commission_pct,0.1)
   		ELSE 0
   	END AS 奖金补助 FROM t_employee;
   	
   	
   SELECT ename, gender, commission_pct,
   	CASE gender
   		WHEN '男' THEN
   			2000 * IFNULL(commission_pct,0.1)
   		WHEN '女' THEN
   			3000 * IFNULL(commission_pct,0.1)
   		ELSE
   			0
   	END AS 奖金补助 FROM t_employee;
   ~~~

### 多行函数/聚合函数

聚合函数作用于全部或者分组数据进行统计和计算，最终返回一条结果。
例如：统计员工数量、员工平均工资，每个部门的人数等！

| **函数**        | **用法**                           |
| --------------- | ---------------------------------- |
| AVG(列名)       | 计算某一列的平均值（数值类型）     |
| SUM(列名)       | 计算某一列的和（数值类型）         |
| MIN(列名)       | 计算某一列的最小值(任意类型)       |
| MAX(列名)       | 计算某一列的最大值(任意类型)       |
| COUNT(列名/*/1) | 计算某一列或者行的记录数(任意类型) |

> 注意：聚合函数不能嵌套调用。比如不能出现类似“AVG(SUM(字段名称))”形式的调用。

~~~mysql
# 求平均工资,最小和最大工资以及总工资
SELECT AVG(salary), MIN(salary), MAX(salary) FROM t_employee;
# 求最大年龄和最小年龄的员工生日
SELECT MIN(birthday),MAX(birthday),MIN(ename) FROM t_employee;
~~~

## 数据库外键约束

### 域（列）级约束

1. 非空约束 NOT NULL

   限定某个字段/列的值不允许为空，关键字 `NOT NULL`，

   > 默认：所有类型列默认都可以为 `null`，包括数字类型。
   > 列上添加：非空约束只能添加到列上！
   > 多次使用：一个表中可以有很多列进行非空限定！
   > 空值判定：空字符串不是 `null`, 0也不是 `null`！

   ~~~mysql
   # 添加非空约束，创建表以后修改
   ALTER TABLE emp1 MODIFY e_age INT NOT NULL;
   # 删除非空约束
   ALTER TABLE emp1 MODIFY e_age INT NULL;
   ALTER TABLE emp1 MODIFY e_name VARCHAR(30);
   ~~~

2. 默认值约束 DEFAULT

   限定某个字段/某列的添加默认值

   > 位置约定：默认值约束不能添加到唯一或者主键上,其他列都可以。
   > 生效时机：当插入数据时，没有显示赋值，则赋予默认值，主动赋值null或者主动赋值，不会走默认值，
   > 细节特点：添加约束时，default 默认值，默认值对应正确数据类型！

   ~~~mysql
   # 添加默认值
   CREATE TABLE emp2 (
   	NAME VARCHAR(20) DEFAULT '小明',
   	age INT NOT NULL
   )
   
   # 修改默认值约束
   ALTER TABLE emp2 MODIFY age INT DEFAULT 18 NOT NULL;
   
   # 删除默认值约束
   ALTER TABLE emp2 MODIFY NAME VARCHAR(20);
   ~~~

3. 检查约束

   限检查某个字段的值是否符号xx要求，一般指的是值的范围

   > CHECK（限制表达式）
   >
   > 检查约束可以实现任何校验功能
   >
   > 检查约束不属于某一个列，术语表级别的约束

   ~~~mysql
   # 添加检查约束：创建员工表emp3(gender 必须是 "男"或者"女"其中的一个)，age必须大于18，
   CREATE TABLE emp3 (
   	gender CHAR,
   	CHECK(gender IN ('男', '女')),
   	age INT
   )
   
   # 建表后修改添加check
   ALTER TABLE emp3 ADD CONSTRAINT check_age CHECK(age >= 18);
   
   # 查看表中的所有约束
   SELECT *
   FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
   WHERE TABLE_SCHEMA = 'book_libs'
   AND TABLE_NAME = 'emp3';
   
   # 删除检查约束
   ALTER TABLE emp3 DROP CONSTRAINT check_age;
   ~~~

### 实体（行）级约束

1. #### 唯一约束

   `UNIQUE`，限定某个字段或者组合字段，在表中的数据是唯一。

   一个表可以有多个列唯一约束，唯一约束可以进行组合列（列1，列2），

   唯一约束可以为 `null`，

   创建唯一约束的时候，约束的名称，默认是列的名字。

   ~~~mysql
   # 建表时添加唯一约束
   CREATE TABLE emp4 (
   	NAME VARCHAR(20) UNIQUE NOT NULL,
   	phone VARCHAR(11) UNIQUE
   );
   
   CREATE TABLE emp5 (
   	NAME VARCHAR(20),
   	phone VARCHAR(11) UNIQUE KEY
   );
   
   CREATE TABLE emp6 (
   	NAME VARCHAR(20),
   	phone VARCHAR(11),
   	UNIQUE KEY(phone)
   );
   
   CREATE TABLE emp7 (
   	classes INT,
   	num INT,
   	NAME VARCHAR(20),
   	phone VARCHAR(11),
   	UNIQUE KEY(classes, phone)
   );
   
   # 查看约束
   SELECT *
   FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
   WHERE TABLE_SCHEMA = 'book_libs'
   AND TABLE_NAME = 'emp7';
   
   # 建表后修改唯一约束
   ALTER TABLE emp7 ADD CONSTRAINT emp7_name UNIQUE KEY(NAME);
   
   # 删除唯一约束
   ALTER TABLE emp7 DROP CONSTRAINT emp7_name;
   ~~~

2. #### 主键约束

   ##### 什么是主键？

   主键就是一个区分一行不重复的列，主键列永远唯一且不为`null`，

   ##### 主键的概念：

   主键分为**自然主键**和**自定义主键**，推荐使用自定义主键。

   **每个表只能有一个主键**，主键可以是单一列也可以是组合列，

   主键类型是任意类型，保证唯一且不为`null`，

   主键 + 主键约束 => 创建主键索引，索引会提升查询效率，建议每个表都要创建主键。

   ##### 主键约束概念

   主键约束是对主键的一种保护限制和约束，语法是 `primary key`，

   没有主键约束的主键也是主键，但是数据安全性得不到保证。

   ~~~mysql
   # 建表时添加
   create table 表名称(
        字段名  数据类型  primary key, #列级模式
   );
   create table 表名称(
       字段名  数据类型,
       [constraint 约束名] primary key(字段名) #表级模式
   );
   
   # 建表后修改
   ALTER TABLE 表名称 ADD PRIMARY KEY(字段列表); 
   #字段列表可以是一个字段，也可以是多个字段
   
   # 删除主键约束，不需要指定主键名，因为一个表只有一个主键，删除主键约束后，非空还存在，唯一消失。
   # 删除主键约束和索引
   alter table 表名称 drop primary key;
   ~~~

   ~~~mysql
   # 创建表时添加
   CREATE TABLE emp8 (
   	e_id INT PRIMARY KEY,
   	e_name VARCHAR(20),
   	e_age INT
   )
   
   CREATE TABLE emp9 (
   	e_id INT,
   	e_name VARCHAR(20),
   	e_age INT,
   	PRIMARY KEY(e_id,e_name)
   );
   
   # 修改表时添加
   ALTER TABLE emp8 ADD PRIMARY KEY(e_id);
   
   # 删除主键约束(不需要写主键约束的名字，因为一个表就只有一个主键)
   ALTER TABLE emp8 DROP PRIMARY KEY;
   ~~~

3. #### 自增长约束

   确保主键列和唯一列的数字类型自动增长，

   为我们插入数据的时候自动赋值，确保主键列和唯一列不会重复，

   建议：主键列 + 数字类型 + 自增长约束

   > 添加位置：只能添加到键列（主键，唯一），普通列不可以。
   > 约束数量：每一张表只能有一个自增长约束。
   > 数据类型：增加自增长约束的列必须是整数类型。
   > 特殊情况：如果给自增长字段设置0或者null，列数据会自增长赋值，如果设置的是非零和非空数据，那么将真实设置值！

   ~~~mysql
   # 建表时添加
   create table 表名称(
       字段名  数据类型  primary key auto_increment,
   );
   create table 表名称(
       字段名  数据类型 unique key auto_increment,
   );
   
   # 建表后修改
   alter table 表名称 modify 字段名 数据类 auto_increment;
   
   # 去掉auto_increment相当于删除
   alter table 表名称 modify 字段名 数据类型; 
   ~~~

   ~~~mysql
   # 建表时添加
   CREATE TABLE emp10 (
   	e_id INT PRIMARY KEY AUTO_INCREMENT,
   	e_name VARCHAR(20)
   );
   
   DESC EMP10;
   
   # 先创建表，再修改表时添加自增长约束
   CREATE TABLE emp12 (
   	e_id INT PRIMARY KEY,
   	e_name VARCHAR(20)
   );
   
   DESC EMP12;
   
   # 不需要再次指定主键约束，主键约束不会被覆盖
   ALTER TABLE emp12 MODIFY e_id INT AUTO_INCREMENT;
   
   # 删除自增长约束
   ALTER TABLE emp12 MODIFY e_id INT;
   ~~~

### 外键约束

#### 什么是外键？

引用或参照其他表主键列值的列，我们称为外键，外键的值范围应当对应引用主键的值范围！！

#### 外键约束？

外键应该引用主键的值，但是如果不添加约束，可能会出现错误数据，例如：MySQL数据，外键约束确保，外键必须且正确引用主键的值的限制！

#### 外键细节说明

外键数量：每个表中可以包含多个外键。

外键跨表：外键是跨表引用其他表的主键，被引用为主表（学生表），外键表为子表（分数表）。

外键类型：外键类型不能是任意类型，应该和主键类型对应，尽量命名相同！

主外键关系：关系型数据库，关系指的就是主外键关系，有主外键的两张表能水平联查。

其他影响：存在主外键关系（外键约束），删除主表数据时,可能会因为子表引用而删除失败。可以先删除子表的所有引用数据再删除!

#### 外键约束语法

~~~mysql
create table 主表名称(
	字段1  数据类型  primary key
);

# 子表中添加主外键约束
CONSTRAINT <外键约束名称>] FOREIGN KEY（外键) references 主表名(主键) [级联配置];

# 创建表后修改外键约束
alter table 从表名 add [CONSTRAINT 约束名] FOREIGN KEY (从表的字段) references 主表名(被引用字段) [级联配置];

# 删除外键约束
# 1. 先删除外键约束
ALTER TABLE 从表名 DROP FOREIGN KEY 外键约束名;
SHOW INDEX FROM 表名称; # 查看某个表的索引名
# 2. 再删除外键索引
ALTER TABLE 从表名 DROP INDEX 索引名;
~~~

~~~mysql
# 创建表时添加外键约束
CREATE TABLE student1 (
	sid INT PRIMARY KEY AUTO_INCREMENT,
	NAME VARCHAR(20)
)

CREATE TABLE score1 (
	cid INT PRIMARY KEY AUTO_INCREMENT,
	NAME INT,
	sid INT,
	CONSTRAINT s_s_1_kf FOREIGN KEY(sid) REFERENCES student1(sid) # 添加外键约束；
)

# 修改表时添加外键约束
CREATE TABLE student2 (
	sid INT PRIMARY KEY AUTO_INCREMENT,
	NAME VARCHAR(20)
);

CREATE TABLE score2 (
	cid INT PRIMARY KEY AUTO_INCREMENT,
	NAME INT,
	sid INT
);

ALTER TABLE score2 ADD CONSTRAINT s_s_2_kf FOREIGN KEY(sid) REFERENCES student2(sid);

# 删除外键约束
# 1. 删除约束
ALTER TABLE score2 DROP FOREIGN KEY s_s_2_kf;
# 2. 查看索引
SHOW INDEX FROM score2;
# 3. 删除索引
ALTER TABLE score2 DROP INDEX s_s_2_kf;
~~~

#### 约束等级设计

| Cascade          | 在父表上update/delete记录时，同步update/delete子表的匹配记录！ |
| ---------------- | ------------------------------------------------------------ |
| Set null         | 在父表上update/delete记录时，将子表上匹配记录的列设为null，但是要注意子表的外键列不能为not null ！ |
| No action        | 如果子表中有匹配的记录，则不允许对父表对应候选键进行update/delete操作 ！ |
| Restrict【默认】 | 同no action， 都是立即检查外键约束！                         |
| Set default      | 父表有变更时，子表将外键列设置成一个默认的值，但Innodb不能识别！ |

最好是采用: ON UPDATE CASCADE ON DELETE RESTRICT 的方式。

## 数据库多表关系

### “数据库多表关系” 概念

1. 关系型数据库中，数据都是按照类别存储到对应的表结构。
2.  表和表之间可以通过主外键建立表(数据)之间关系。
3. 拆表存储可以减少数据冗余，并提高数据查询和操作的效率。

4. 因为拆表存储的原因，我们不仅要掌握单表的查询语法还需要掌握多表关联查询语法。
5. 关系型数据库需要提前创建库表结构，所以我们还需要通过分析数据关系在建表添加合理约束。

### 多(两)表(数据)关系

1. 一对一

   > 两个表之间的每行数据都是唯一的对应关系!
   > 例如，一个员工与其唯一的员工档案。

2. 一对多

   > 一个表关联另一个表多行数据,反方向只关联一行数据!
   > 例如，一个作者与多个文章的关系。

3. 多对多

   > 两个表中的记录都可以与对方表中的多个记录相关联!
   > 例如，学生和课程之间的关系，一个学生可以选修多门课程，而一门课程也可以由多个学生选修。

### 多表关系总结

1. 分表存储数据

   关系型数据库,数据就是按照类别存储到对应的表结构中,每个表中的数据类型单一

2. 表和表的关系

   两表之间的数据可以通过主外键进行引用,且创建数据行之间的关系,表关系就是数据行的关系

3. 具体关系分类

   两表（数据）之间的关系具体分为三种: 一对一、一对多、多对多！（双向查看）

4. 多表结构约束

   我们需要根据分析的实体之间关系，为之创建对应的表结构和添加合适的表约束限制

5. 查询语法扩展

   因为数据分表存储，我们不仅要掌握单表查询，还需根据多表关系，进行多表数据之间的关联查询（重点）

### 一对一关系语法

~~~mysql
# 一对一员工档案表
CREATE TABLE employee(
    e_id  int primary key auto_increment,
    e_name  varchar(20) NOT NULL,  
    e_age  int default 18,
    e_gender  char default  ‘男’
);

# 子表：档案表1(有外键且外键添加唯一约束，实现一对一关系)
CREATE TABLE profile1(
    p_id  int primary key auto_increment, # 有主键
    p_address varchar(100) NOT NULL,  
    p_level  int  default 10,
    e_id int unique ,  # 外键唯一
    CONSTRAINT s_p_1  FOREIGN KEY(e_id) references employee(e_id) 
);

# 子表：档案表2(外键当主键，实现一对一关系)
CREATE TABLE profile2(
    e_id  int primary key,
    p_address varchar(100) NOT NULL,  
    p_level  int  default 10,
    CONSTRAINT s_p_2  FOREIGN KEY (e_id) references employee(e_id)
);
~~~

### 一对多表语法

一对多特点: 主表对应多条子表数据,子表对应主表至多一条数据

~~~mysql
# 一对多 作者和文章表
CREATE TABLE author(
    a_id  int primary key auto_increment,
    a_name  varchar(20) NOT NULL,  
    a_age  int default 18,
    a_gender  char default  ‘男’
);

CREATE TABLE blog(
    b_id  int primary key auto_increment,
    b_title varchar(100) NOT NULL,  
    b_content varchar(600) NOT NULL,  
    a_id int ,  # 外键
    CONSTRAINT a_b_fk  FOREIGN KEY(a_id) references author(a_id) 
);
~~~

### 多对多表语法

多对多特点: 双方的数据行都可以对应对方多条数据

> 多对多特殊情况：多对多需要创建中间表建立数据之间的关联，中间表主键不能添加唯一约束，
> 多对多关系维护：中间表包含两个外键,主表数据之间间接关联

~~~mysql
# 主表：学生表
CREATE TABLE student(
    s_id  int primary key auto_increment,
    s_name  varchar(20) NOT NULL,  
    s_age  int default 18
);

# 中间表：student_course
CREATE TABLE student_course(
    sc_id  int primary key auto_increment,
    s_id int,  
    c_id  int,
    FOREIGN KEY(s_id) references student(s_id) ,
    FOREIGN KEY(c_id) references course(c_id) 
);

# 主表：课程表
CREATE TABLE course(
    c_id  int primary key auto_increment,
    c_name varchar(10) NOT NULL,  
    c_teacher  varchar(10) 
);
~~~

## 数据查询语句-多表

### 多表查询语句（DQL）语法理解

多表查询的重点是将多张表数据利用`多表查询语法`合并成单张虚拟表，
按照多表结果合并的方向,可以分为："水平合并语法"和"垂直合并语法"

### 合并结果集语法(垂直)

实现要求：只要求合并的结果集之间的列数和对应列的类型相同即可
主外键要求：union只是结果集垂直汇总，不涉及行数据水平连接，不要求有主外键
重复数据认定：一行中的所有列值都相同，认定为重复行

~~~mysql
# 数据库多表查询(DQL)
CREATE TABLE a (
	aid INT,
	aname VARCHAR(10)
);

CREATE TABLE b (
	bid INT,
	bname VARCHAR(10)
);


INSERT INTO a VALUES (1, 'aaa'), (2, 'bbb'), (3, 'ccc');
INSERT INTO b VALUES (4, 'aaa'), (2, 'bbb'), (3, 'ccc');


# 去除重复列并合并(将a表和b表的数据去重后合并)
SELECT aid, aname FROM a
UNION
SELECT bid, bname FROM b;

# 不去重合并
SELECT aid, aname FROM a
UNION ALL
SELECT bid, bname FROM b;
~~~

#### 语法

> `union`  合并记录同时去掉重复数据
> `union all`  合并记录,且不去掉重复数据

### 连接查询语法(水平)

核心要求：水平连接是行和行数据连接，要求两个表必须有关系(主外键)
正确连接：为了正确的将行数据之间连接，水平连接需要额外判定主外键相等
拆表产物：因为关系型数据库特点，数据进行拆表存储,所以水平连接语法非常重要
语法理解：别看水平连接有多种语法，但是基本大同小异,只要理解内外区别即可

#### 内连接

内连接（inner join）是一种用于从两个或多个表中检索数据的查询方式。内连接会根据指定的连接条件，将两个表中满足条件的行进行匹配，并返回匹配成功的行！

1. 语法：

   ~~~mysql
   select 列  from 表1 [ inner ] join 表2 on 表1.主键 = 表2.外键  (标准)
   select 列  from 表1,表2 where 表1.主键 = 表2.外键  (非标准)
   ~~~

2. 以上两种语法功能和效果相同，推荐标准语法

   标准的内连接更通用! 两者效果一致, 内连接的特点就是**两个表必须满足主外键相等**，方可返回数据；

3. 为了避免错误的数据连接，连接查询必须添加主外键相等条件

   连接查询就是将所有数据行相互拼接一次！例如: A和B连接查询， A有3条数据，B有4条数据，会出现12条数据的结果，但是数据行不一定正确连接，这就是经典的笛卡尔积问题！我们可以通过添加**主外键相等**，进行正确数据筛选！

4. 多表查询要考虑不同表存在相同字段名的问题

   多表中很大概率存在相同的名称的列(主外键一般命名相同)，在`select`后或者 `条件比较列` 的时候，需使用表名.列名！ 但是表名可能较长，**可以给表名起别名**，语法为: from 表 别名 | from as 别名！这样就就可以通过: `表别名.列名`

~~~mysql
# 情景1: 基础语法和笛卡尔积 [不添加主外键相等, 连接查询的实现原理]
# 查询[[员工编号、姓名以及所属部门的编号]]和[[部门名称]] -> 多表查询 -> 水平多表查询 -> 关系(存在主外键)
# 1. 标准语法  表1 别名 [inner] join 表2 别名 on 主 = 外
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee AS e INNER JOIN t_department AS d;
# 连接查询,就是将所有的行,都给你拼接一遍,拼成单表! (笛卡尔积 | 连接查询的原理)
# 2. 非标准语法  表1 别名 , 表2 别名 where 主 = 外
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee AS e, t_department AS d;



# 情景2: 主外键条件和正确连接 
# 查询员工编号、姓名以及所属部门的编号和部门名称
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee e INNER JOIN t_department d ON e.did = d.did;
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee e, t_department d WHERE e.did = d.did;
# 获取正确数据,需要添加主外键相等条件 (唯一的要求)
# join标准语法 on 添加主外键
# 非标准语法 表1,表2  where 添加主外键相等即可



# 情景3: 标准inner join语法优化 
# 查询员工编号、姓名以及所属部门的编号和部门名称
# 27个员工 | 周州(27) did -> null没有部门 -> 周州(第27条数据)这条数据就查不到
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee e JOIN t_department d  ON e.did = d.did;
# inner join  == join == 内连接



# 情景4: 添加额外的条件筛选
# 查询员工编号大于10的[员工编号、姓名以及所属部门的编号和部门名称]
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee e INNER JOIN t_department d  ON e.did = d.did WHERE e.eid > 10;                                                                                                    
SELECT e.eid , e.ename, e.did , d.did , d.dname FROM t_employee e, t_department d WHERE e.did = d.did AND e.eid > 10;
# 如果有额外的条件(非主外键相等) 两种都正常添加where即可! 添加条件
# 理解: 多表查询 -> 表结果进行拼接 -> 依然正常使用查询语法



# 情景5: 多张表(3+)查询并且添加额外的条件筛选
# 查询员工编号大于10的员工编号、姓名以及所属部门的编号和部门名称,岗位名称
# 员工和部门 | 员工和岗位
# 多表查询就是一个伪命题! 实际上就是多个两表查询! 
# 2张表 1个两表查询
# 3张彪 2个两表查询
SELECT e.eid , e.ename, e.did , d.did , d.dname, e.job_id, j.jname FROM t_employee e INNER JOIN t_department d  ON e.did = d.did INNER JOIN t_job j ON e.job_id = j.jid WHERE e.eid > 10;
SELECT e.eid , e.ename, e.did , d.did , d.dname, e.job_id, j.jname FROM t_employee e , t_department d  , t_job j WHERE e.did = d.did AND e.job_id = j.jid AND e.eid > 10;
~~~



#### 外连接

外连接（outer join）是一种用于从两个或多个表中检索数据的查询方式，与内连接不同的是，外连接会返回所有符合条件的行，**同时还会返回未匹配的行**。外连接分为**左外连接（LEFT JOIN）**、**右外连接（RIGHT JOIN）**!

1. 语法

   ~~~mysql
   select *  from 表1 left  [ outer] join 表2 on 表1.主键 = 表2.外键  (左外)
   select *  from 表1 right [ outer] join 表2 on 表1.主键 = 表2.外键  (右外)
   ~~~

2. 内连接和外连接语法效果区别

   内连接: 只满足匹配条件的行数，两个表必须存在且主外键值相等才会返回
   外连接: 可以通过左和右指定一个逻辑主表，逻辑主表数据一定会查询到

3. 外连接语法可以省略和优化

   外连接的语法也可以省略 [outer] 
   `left | right outer join  = left | right join`
   `left` 和 `right` 就是指定左还右是逻辑主表

4. 外连接的连续性

   建议将分析的逻辑主表放在第一个位置(最左)，那么本次查询必然全部是左外连接!
   `from 逻辑主表 left join 表2 on 主 = 外 left join 表3 on 主 = 外 left join .....`

~~~mysql
# 情景1: 基础语法和笛卡尔积 [外连接错误语法]
# 查询[所有]员工编号、姓名以及所属部门的编号和部门名称
# 注意: 外连接必须添加主外键相等 错误代码： 1064
# SELECT * FROM t_employee e LEFT JOIN t_department d; --- 语法报错了
SELECT * FROM t_employee e LEFT JOIN t_department d ON e.did = d.did; # --- 正确语法


# 情景2: 主外键条件和正确连接 [正确语法] 
# 查询所有员工编号、姓名以及所属部门的编号和部门名称
SELECT e.eid,e.ename, IFNULL(d.dname,'暂时未分配') FROM t_employee e LEFT JOIN t_department d ON e.did = d.did;
SELECT e.eid,e.ename, IFNULL(d.dname,'暂时未分配') FROM t_department d  RIGHT JOIN  t_employee e  ON e.did = d.did;


# 情景3: 添加额外的条件筛选 
# 查询员工编号大于10的员工编号、姓名以及所属部门的编号和部门名称
SELECT e.eid,e.ename, IFNULL(d.dname,'暂时未分配') FROM t_department d  RIGHT JOIN  t_employee e  ON e.did = d.did WHERE e.eid > 10;


# 情景4: 多表(3+)查询并且添加额外的条件筛选 
# 查询员工编号大于10的员工编号、姓名以及所属部门的编号和部门名称,岗位名称
# 先找到逻辑主表,把逻辑主表放在第一位,后续都是left join 
SELECT e.eid,e.ename, IFNULL(d.dname,'暂时未分配') , j.jname FROM t_employee e LEFT JOIN     	t_department d   ON e.did = d.did LEFT JOIN  t_job j ON e.job_id = j.jid
WHERE e.eid > 10;
~~~















































































