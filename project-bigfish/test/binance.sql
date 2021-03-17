CREATE TABLE public."orderDetail"
(
    "orderId" bigint NOT NULL,
    symbol character varying(255) COLLATE pg_catalog."default",
    side character varying(255) COLLATE pg_catalog."default",
    "orderType" character varying(255) COLLATE pg_catalog."default",
    "orderTradeTime" bigint,
    "originalPrice" character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    "originalQuantity" character varying(10) COLLATE pg_catalog."default",
    "orderFilledAccumulatedQuantity" character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT "orderId" PRIMARY KEY ("orderId")
)

TABLESPACE pg_default;

ALTER TABLE public."orderDetail"
    OWNER to postgres;