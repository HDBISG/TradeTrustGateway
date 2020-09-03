
drop table T_TTGW_WALLET;

CREATE TABLE `T_TTGW_WALLET` (
  `WALLET_ACCN_ID` varchar(35) NOT NULL,
  `WALLET_ADDR` varchar(128) NOT NULL,
  `WALLET_PASSWORD` varchar(128) NOT NULL,
  `WALLET_JSON` VARCHAR(2048) DEFAULT NULL,
  `WALLET_STATUS` varchar(10) NOT NULL,
  `WALLET_UID_CREATE` varchar(35) DEFAULT NULL,
  `WALLET_DT_CREATE` datetime DEFAULT NULL,
  `WALLET_UID_UPD` varchar(35) DEFAULT NULL,
  `WALLET_DT_UPD` datetime DEFAULT NULL,
  PRIMARY KEY (`WALLET_ADDR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table T_TTGW_DOCSTORE;

CREATE TABLE `T_TTGW_DOCSTORE` (
  `DOCSTORE_ACCN_ID` varchar(35) NOT NULL,
  `DOCSTORE_NAME` varchar(128) NOT NULL,
  `DOCSTORE_ADDR` varchar(128) NOT NULL,
  `DOCSTORE_NETWORK` VARCHAR(128) DEFAULT NULL,
  `DOCSTORE_STATUS` varchar(10) NOT NULL,
  `DOCSTORE_UID_CREATE` varchar(35) DEFAULT NULL,
  `DOCSTORE_DT_CREATE` datetime DEFAULT NULL,
  `DOCSTORE_UID_UPD` varchar(35) DEFAULT NULL,
  `DOCSTORE_DT_UPD` datetime DEFAULT NULL,
  PRIMARY KEY (`DOCSTORE_NAME`,`DOCSTORE_ADDR` )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


drop table T_TTGW_DOC;

CREATE TABLE `T_TTGW_DOC` (
  `DOC_DOC_ID` varchar(128) NOT NULL,
  `DOC_ACCN_ID` varchar(35) NOT NULL,
  `DOC_STORE_NAME` varchar(128) NOT NULL,
  `DOC_WRAP_HASH` VARCHAR(128) DEFAULT NULL,
  `DOC_ADDR` varchar(128) NOT NULL,
  `DOC_WRAP_DOC` MEDIUMTEXT NOT NULL,
  `DOC_WRAP_RAW_DOC` MEDIUMTEXT DEFAULT NULL,
  `DOC_STATUS` varchar(10) NOT NULL,
  `DOC_UID_CREATE` varchar(35) DEFAULT NULL,
  `DOC_DT_CREATE` datetime DEFAULT NULL,
  `DOC_UID_UPD` varchar(35) DEFAULT NULL,
  `DOC_DT_UPD` datetime DEFAULT NULL,
  PRIMARY KEY (`DOC_DOC_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

