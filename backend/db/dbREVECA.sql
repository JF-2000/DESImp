USE [master]
GO
/****** Object:  Database [dbREVECA]    Script Date: 7/20/2022 4:57:58 PM ******/
CREATE DATABASE [dbREVECA]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'dbREVECA', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\dbREVECA.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'dbREVECA_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\dbREVECA_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [dbREVECA] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [dbREVECA].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [dbREVECA] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [dbREVECA] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [dbREVECA] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [dbREVECA] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [dbREVECA] SET ARITHABORT OFF 
GO
ALTER DATABASE [dbREVECA] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [dbREVECA] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [dbREVECA] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [dbREVECA] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [dbREVECA] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [dbREVECA] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [dbREVECA] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [dbREVECA] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [dbREVECA] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [dbREVECA] SET  DISABLE_BROKER 
GO
ALTER DATABASE [dbREVECA] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [dbREVECA] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [dbREVECA] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [dbREVECA] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [dbREVECA] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [dbREVECA] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [dbREVECA] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [dbREVECA] SET RECOVERY FULL 
GO
ALTER DATABASE [dbREVECA] SET  MULTI_USER 
GO
ALTER DATABASE [dbREVECA] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [dbREVECA] SET DB_CHAINING OFF 
GO
ALTER DATABASE [dbREVECA] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [dbREVECA] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [dbREVECA] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'dbREVECA', N'ON'
GO
ALTER DATABASE [dbREVECA] SET QUERY_STORE = OFF
GO
USE [dbREVECA]
GO
/****** Object:  Table [dbo].[bienes]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bienes](
	[idbien] [int] IDENTITY(1,1) NOT NULL,
	[idtipobien] [int] NOT NULL,
	[descripcion] [text] NOT NULL,
	[direccion] [text] NULL,
	[idgrupo] [int] NULL,
	[disponible] [int] NOT NULL,
	[activo] [int] NOT NULL,
 CONSTRAINT [PK_bienes] PRIMARY KEY CLUSTERED 
(
	[idbien] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[clientes]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[clientes](
	[idcliente] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[cedula] [varchar](15) NOT NULL,
	[telefono] [varchar](15) NOT NULL,
	[tipoidentif] [int] NULL,
	[activo] [int] NOT NULL,
 CONSTRAINT [PK_clientes] PRIMARY KEY CLUSTERED 
(
	[idcliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[contrato]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contrato](
	[idcontrato] [int] IDENTITY(1,1) NOT NULL,
	[idcliente] [int] NOT NULL,
	[idbien] [int] NOT NULL,
	[idfactura] [int] NULL,
	[idpago] [int] NULL,
	[fechaini] [date] NOT NULL,
	[fechafin] [date] NOT NULL,
	[fechafactini] [date] NULL,
	[fechafactfin] [date] NULL,
	[monto] [money] NOT NULL,
	[balance] [money] NULL,
	[idplazo] [int] NULL,
	[agrupado] [bit] NULL,
	[deposito] [int] NULL,
	[activo] [int] NULL,
 CONSTRAINT [PK_contrato] PRIMARY KEY CLUSTERED 
(
	[idcontrato] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[facturas]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[facturas](
	[idfactura] [int] IDENTITY(1,1) NOT NULL,
	[idcontrato] [int] NOT NULL,
	[fecha] [date] NULL,
	[monto] [money] NOT NULL,
	[balance] [money] NULL,
	[concepto] [text] NULL,
	[estado] [varchar](10) NULL,
 CONSTRAINT [PK_facturas] PRIMARY KEY CLUSTERED 
(
	[idfactura] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gastos]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gastos](
	[idgasto] [int] IDENTITY(1,1) NOT NULL,
	[idgrupo] [int] NOT NULL,
	[concepto] [text] NOT NULL,
	[monto] [money] NOT NULL,
	[fecha] [date] NOT NULL,
	[activo] [int] NOT NULL,
 CONSTRAINT [PK_gastos] PRIMARY KEY CLUSTERED 
(
	[idgasto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupos]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupos](
	[idgrupo] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](30) NOT NULL,
	[activo] [int] NOT NULL,
 CONSTRAINT [PK_grupos] PRIMARY KEY CLUSTERED 
(
	[idgrupo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ingresos]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ingresos](
	[idingreso] [int] IDENTITY(1,1) NOT NULL,
	[idcliente] [int] NULL,
	[concepto] [text] NULL,
	[fecha] [date] NULL,
	[monto] [money] NULL,
	[balance] [money] NULL,
	[activo] [int] NULL,
 CONSTRAINT [PK_ingresos] PRIMARY KEY CLUSTERED 
(
	[idingreso] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pagos]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pagos](
	[idpago] [int] IDENTITY(1,1) NOT NULL,
	[idcontrato] [int] NOT NULL,
	[fecha] [datetime] NOT NULL,
	[monto] [money] NOT NULL,
	[idfactura] [int] NULL,
	[fechafactura] [date] NULL,
	[concepto] [text] NULL,
	[balance] [money] NOT NULL,
	[formapago] [char](2) NULL,
	[recibidopor] [text] NULL,
	[pagopor] [text] NULL,
 CONSTRAINT [PK_pagos] PRIMARY KEY CLUSTERED 
(
	[idpago] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[plazos]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[plazos](
	[idplazo] [int] IDENTITY(1,1) NOT NULL,
	[plazo] [varchar](20) NOT NULL,
	[dias] [int] NULL,
 CONSTRAINT [PK_plazos] PRIMARY KEY CLUSTERED 
(
	[idplazo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipobien]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipobien](
	[idtipobien] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](30) NOT NULL,
	[trenta] [varchar](10) NULL,
	[activo] [int] NOT NULL,
 CONSTRAINT [PK_tipobien] PRIMARY KEY CLUSTERED 
(
	[idtipobien] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 7/20/2022 4:57:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[iduser] [int] IDENTITY(1,1) NOT NULL,
	[usuario] [varchar](30) NULL,
	[password] [varchar](50) NULL,
	[auth] [int] NULL,
 CONSTRAINT [PK_usuarios] PRIMARY KEY CLUSTERED 
(
	[iduser] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[bienes] ADD  CONSTRAINT [DF_bienes_idtipobien]  DEFAULT ((0)) FOR [idtipobien]
GO
ALTER TABLE [dbo].[bienes] ADD  CONSTRAINT [DF_bienes_descripcion]  DEFAULT ('') FOR [descripcion]
GO
ALTER TABLE [dbo].[bienes] ADD  CONSTRAINT [DF_bienes_direccion]  DEFAULT ('') FOR [direccion]
GO
ALTER TABLE [dbo].[bienes] ADD  CONSTRAINT [DF_bienes_idgrupo]  DEFAULT ((0)) FOR [idgrupo]
GO
ALTER TABLE [dbo].[bienes] ADD  CONSTRAINT [DF_bienes_disponible]  DEFAULT ((1)) FOR [disponible]
GO
ALTER TABLE [dbo].[bienes] ADD  CONSTRAINT [DF_bienes_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[clientes] ADD  CONSTRAINT [DF_clientes_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[contrato] ADD  CONSTRAINT [DF_contrato_idfactura]  DEFAULT ((0)) FOR [idfactura]
GO
ALTER TABLE [dbo].[contrato] ADD  CONSTRAINT [DF_contrato_idpago]  DEFAULT ((0)) FOR [idpago]
GO
ALTER TABLE [dbo].[contrato] ADD  CONSTRAINT [DF_contrato_deposito]  DEFAULT ((0)) FOR [deposito]
GO
ALTER TABLE [dbo].[contrato] ADD  CONSTRAINT [DF_contrato_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[facturas] ADD  CONSTRAINT [DF_facturas_balance]  DEFAULT ((0)) FOR [balance]
GO
ALTER TABLE [dbo].[facturas] ADD  CONSTRAINT [DF_facturas_concepto]  DEFAULT ('') FOR [concepto]
GO
ALTER TABLE [dbo].[facturas] ADD  CONSTRAINT [DF_facturas_estado]  DEFAULT ('D') FOR [estado]
GO
ALTER TABLE [dbo].[gastos] ADD  CONSTRAINT [DF_gastos_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[ingresos] ADD  CONSTRAINT [DF_ingresos_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[pagos] ADD  CONSTRAINT [DF_pagos_concepto]  DEFAULT ('') FOR [concepto]
GO
ALTER TABLE [dbo].[pagos] ADD  CONSTRAINT [DF_pagos_recibidopor]  DEFAULT ('') FOR [recibidopor]
GO
ALTER TABLE [dbo].[pagos] ADD  CONSTRAINT [DF_pagos_pagopor]  DEFAULT ('') FOR [pagopor]
GO
ALTER TABLE [dbo].[tipobien] ADD  CONSTRAINT [DF_tipobien_trenta]  DEFAULT ('') FOR [trenta]
GO
ALTER TABLE [dbo].[tipobien] ADD  CONSTRAINT [DF_tipobien_activo]  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[usuarios] ADD  CONSTRAINT [DF_usuarios_auth]  DEFAULT ((1)) FOR [auth]
GO
USE [master]
GO
ALTER DATABASE [dbREVECA] SET  READ_WRITE 
GO
