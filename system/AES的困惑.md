[TOC]


### 非对称加密


+ 公钥加密只有私钥才能解密，私钥加密只有公钥才能解密。
+ 非对称加密算法比对称加密算法慢数千倍


主要算法：RSA、Elgamal、背包算法、Rabin、



### 对称加密算法

常用：AES、DES、3DES、RC2、RC4、RC5、



#### AES 并不等于Rijndael。


> php 实现AES 加密解密



AES 的定义：

AES的区块长度固定为128比特，密钥长度则可以是128，192或256比特；

Rijndael使用的密钥和区块长度均可以是128，192或256比特。加密过程中使用的密钥是由Rijndael密钥生成方案产生。

大多数AES计算是在一个特别的有限域完成的。




AES不等于“Rijndael”，AES是Rigndael的子集。

+ AES 固定块大小：128bit,key size.
+ Rijndael block size 和 key size 可以是32bit的整数倍，最小128，最大256bits.


PHP提供了Rijndael 算法的一般实现，PHP mcrypt 无意中做了误导，很多用户认为MCRYPT_RIJNDAEL_256 的256是加密强度，其实他只是设置了算法的block size.

The AES encryption standard is defined as Rjindael encryption (128-bit, 192-bit, or 256-bit) using a block size of 16 bytes. 
Chilkat implements the AES encryption standard.

When you specify MCRYPT_RIJNDAEL_256 in PHP, you are *NOT* setting the encryption strength to 256-bits. You are setting the block size to 256 bits. This is NOT AES encryption. To properly produce 256-bit AES encryption in PHP, you must provide a 32-byte encryption key (which implicitly sets the encryption strength), but the block size must be set to MCRYPT_RIJNDAEL_128 (16 bytes).
 
在PHP中实现256-bit AES算法，必须提供32位的密匙（设置加密强度），但block size 必须设置为128 bytes.


> 参考 [PHP AES/Rijndael Encryption Confusion](http://cknotes.com/php-aesrijndael-encryption-confusion/)




The Rijndael encyrption algorithm is a block cipher.  It operates on discrete blocks of data.  Padding MUST be added such that the data to be encrypted has a length that is a multiple of the block size.(PHP pads with NULL bytes)

Rijndael 是分组加密算法，需要对数据做填充以使得数据长度是块大小的整数倍




 CBC mode requires an initialization vector.  The size of the IV (initialization vector) is always equal to the block-size.  (It is NOT equal to the key size.) Given that our block size is 128-bits, the IV is also 128-bits (i.e. 16 bytes). Thus, for AES encryption, the IV is always 16 bytes regardless of the  strength of encryption.

IV 的size和block-size  一样


> 参考：[Understanding PHP AES Encryption](http://www.chilkatsoft.com/p/php_aes.asp)

