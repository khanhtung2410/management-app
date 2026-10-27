USE [ManagementDb];


GO
ALTER TABLE [dbo].[CongViec] DROP CONSTRAINT [FK_CongViec_User];


GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [DF_User_TrangThai];


GO
ALTER TABLE [dbo].[CongViec] DROP CONSTRAINT [DF_CongViec_TrangThai];


GO
/****** Object:  Index [UQ_User_Email]    Script Date: 10/17/2026 11:17:48 AM ******/
ALTER TABLE [dbo].[User] DROP CONSTRAINT [UQ_User_Email];


GO
/****** Object:  Table [dbo].[User]    Script Date: 10/17/2026 11:17:49 AM ******/
IF EXISTS (SELECT	*
			FROM		sys.objects
			WHERE	object_id = OBJECT_ID(N'[dbo].[User]')
					AND type IN (N'U'))
	DROP TABLE [dbo].[User];


GO
/****** Object:  Table [dbo].[Roles]    Script Date: 10/17/2026 11:17:49 AM ******/
IF EXISTS (SELECT	*
			FROM		sys.objects
			WHERE	object_id = OBJECT_ID(N'[dbo].[Roles]')
					AND type IN (N'U'))
	DROP TABLE [dbo].[Roles];


GO
/****** Object:  Table [dbo].[CongViec]    Script Date: 10/17/2026 11:17:49 AM ******/
IF EXISTS (SELECT	*
			FROM		sys.objects
			WHERE	object_id = OBJECT_ID(N'[dbo].[CongViec]')
					AND type IN (N'U'))
	DROP TABLE [dbo].[CongViec];


GO
/****** Object:  User [management_app]    Script Date: 10/17/2026 11:17:49 AM ******/
DROP USER [management_app];


GO
USE [master];


GO
/****** Object:  Database [ManagementDb]    Script Date: 10/17/2026 11:17:49 AM ******/
DROP DATABASE [ManagementDb];


GO
/****** Object:  Database [ManagementDb]    Script Date: 10/17/2026 11:17:49 AM ******/
CREATE DATABASE [ManagementDb] CONTAINMENT = NONE
	ON 
	PRIMARY(NAME = N'ManagementDb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.TUNG\MSSQL\DATA\ManagementDb.mdf', SIZE = 8192 KB, MAXSIZE = UNLIMITED, FILEGROWTH = 65536 KB)
	LOG ON (NAME = N'ManagementDb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.TUNG\MSSQL\DATA\ManagementDb_log.ldf', SIZE = 8192 KB, MAXSIZE = 2048 GB, FILEGROWTH = 65536 KB)
	WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF;


GO
ALTER DATABASE [ManagementDb]
	SET COMPATIBILITY_LEVEL = 160;


GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
	BEGIN
		EXECUTE [ManagementDb].[dbo].[sp_fulltext_database] @action = 'enable';
	END


GO
ALTER DATABASE [ManagementDb]
	SET ANSI_NULL_DEFAULT OFF;


GO
ALTER DATABASE [ManagementDb]
	SET ANSI_NULLS OFF;


GO
ALTER DATABASE [ManagementDb]
	SET ANSI_PADDING OFF;


GO
ALTER DATABASE [ManagementDb]
	SET ANSI_WARNINGS OFF;


GO
ALTER DATABASE [ManagementDb]
	SET ARITHABORT OFF;


GO
ALTER DATABASE [ManagementDb]
	SET AUTO_CLOSE OFF;


GO
ALTER DATABASE [ManagementDb]
	SET AUTO_SHRINK OFF;


GO
ALTER DATABASE [ManagementDb]
	SET AUTO_UPDATE_STATISTICS ON;


GO
ALTER DATABASE [ManagementDb]
	SET CURSOR_CLOSE_ON_COMMIT OFF;


GO
ALTER DATABASE [ManagementDb]
	SET CURSOR_DEFAULT GLOBAL;


GO
ALTER DATABASE [ManagementDb]
	SET CONCAT_NULL_YIELDS_NULL OFF;


GO
ALTER DATABASE [ManagementDb]
	SET NUMERIC_ROUNDABORT OFF;


GO
ALTER DATABASE [ManagementDb]
	SET QUOTED_IDENTIFIER OFF;


GO
ALTER DATABASE [ManagementDb]
	SET RECURSIVE_TRIGGERS OFF;


GO
ALTER DATABASE [ManagementDb]
	SET ENABLE_BROKER;


GO
ALTER DATABASE [ManagementDb]
	SET AUTO_UPDATE_STATISTICS_ASYNC OFF;


GO
ALTER DATABASE [ManagementDb]
	SET DATE_CORRELATION_OPTIMIZATION OFF;


GO
ALTER DATABASE [ManagementDb]
	SET TRUSTWORTHY OFF;


GO
ALTER DATABASE [ManagementDb]
	SET ALLOW_SNAPSHOT_ISOLATION OFF;


GO
ALTER DATABASE [ManagementDb]
	SET PARAMETERIZATION SIMPLE;


GO
ALTER DATABASE [ManagementDb]
	SET READ_COMMITTED_SNAPSHOT OFF;


GO
ALTER DATABASE [ManagementDb]
	SET HONOR_BROKER_PRIORITY OFF;


GO
ALTER DATABASE [ManagementDb]
	SET RECOVERY FULL;


GO
ALTER DATABASE [ManagementDb]
	SET MULTI_USER;


GO
ALTER DATABASE [ManagementDb]
	SET PAGE_VERIFY CHECKSUM;


GO
ALTER DATABASE [ManagementDb]
	SET DB_CHAINING OFF;


GO
ALTER DATABASE [ManagementDb]
	SET FILESTREAM(NON_TRANSACTED_ACCESS = OFF);


GO
ALTER DATABASE [ManagementDb]
	SET TARGET_RECOVERY_TIME = 60 SECONDS;


GO
ALTER DATABASE [ManagementDb]
	SET DELAYED_DURABILITY = DISABLED;


GO
ALTER DATABASE [ManagementDb]
	SET ACCELERATED_DATABASE_RECOVERY = OFF;


GO
EXECUTE sys.sp_db_vardecimal_storage_format N'ManagementDb', N'ON';


GO
ALTER DATABASE [ManagementDb]
	SET QUERY_STORE = ON;


GO
ALTER DATABASE [ManagementDb]
	SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON);


GO
USE [ManagementDb];


GO
/****** Object:  User [management_app]    Script Date: 10/17/2026 11:17:50 AM ******/
CREATE USER [management_app] FOR LOGIN [management_app]
	WITH DEFAULT_SCHEMA = [dbo];


GO
ALTER ROLE [db_ddladmin] ADD MEMBER [management_app];


GO
ALTER ROLE [db_datareader] ADD MEMBER [management_app];


GO
ALTER ROLE [db_datawriter] ADD MEMBER [management_app];


GO
/****** Object:  Table [dbo].[CongViec]    Script Date: 10/17/2026 11:17:50 AM ******/
SET ANSI_NULLS ON;


GO
SET QUOTED_IDENTIFIER ON;


GO
CREATE TABLE [dbo].[CongViec] (
	[ID]		INT				IDENTITY (1, 1) NOT NULL,
	[UserID]	INT				NOT NULL,
	[Ten]		NVARCHAR (255)	NOT NULL,
	[Mota]		NVARCHAR (MAX)	NULL,
	[HetHan]	DATETIME		NULL,
	[TrangThai]	INT				NOT NULL,
	CONSTRAINT [PK_CongViec] PRIMARY KEY CLUSTERED ([ID] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];


GO
/****** Object:  Table [dbo].[Roles]    Script Date: 10/17/2026 11:17:50 AM ******/
SET ANSI_NULLS ON;


GO
SET QUOTED_IDENTIFIER ON;


GO
CREATE TABLE [dbo].[Roles] (
	[Id]		INT				IDENTITY (1, 1) NOT NULL,
	[RoleName]	NVARCHAR (64)	NOT NULL,
	PRIMARY KEY CLUSTERED ([Id] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY];


GO
/****** Object:  Table [dbo].[User]    Script Date: 10/17/2026 11:17:50 AM ******/
SET ANSI_NULLS ON;


GO
SET QUOTED_IDENTIFIER ON;


GO
CREATE TABLE [dbo].[User] (
	[ID]			INT				IDENTITY (1, 1) NOT NULL,
	[HoTen]			NVARCHAR (255)	NOT NULL,
	[Email]			VARCHAR (255)	NOT NULL,
	[SDT]			VARCHAR (10)	NULL,
	[RoleId]		INT				NOT NULL,
	[TrangThai]		INT				NOT NULL,
	[PasswordHash]	NVARCHAR (255)	NOT NULL,
	CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([ID] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY];


GO
SET IDENTITY_INSERT [dbo].[CongViec] ON;

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (1, 531, N'Kiểm tra log hệ thống', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-01T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (2, 180, N'Viết unit test', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-02T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (3, 619, N'Đánh giá hiệu năng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-06T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (4, 171, N'Tối ưu query chậm', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-28T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (5, 664, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-25T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (6, 423, N'Kiểm tra bảo mật', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-31T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (7, 253, N'Backup database', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-06T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (8, 483, N'Chuẩn bị release note', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-23T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (9, 31, N'Deploy phiên bản mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-11T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (10, 277, N'Tối ưu query chậm', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-30T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (11, 203, N'Viết unit test', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-05T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (12, 395, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-16T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (13, 450, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-03T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (14, 632, N'Review code', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-15T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (15, 634, N'Họp nhóm dự án', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-07T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (16, 249, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-16T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (17, 102, N'Kiểm tra log hệ thống', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-01T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (18, 87, N'Kiểm tra bảo mật', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-26T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (19, 666, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-19T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (20, 466, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-03T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (21, 637, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-11T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (22, 605, N'Chuẩn bị release note', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-19T15:43:26.183' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (23, 438, N'Refactor module auth', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-16T15:43:26.183' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (24, 6, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-17T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (25, 126, N'Chuẩn bị release note', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-13T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (26, 518, N'Test chức năng đăng nhập', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-06T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (27, 556, N'Tối ưu query chậm', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-08T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (28, 181, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-11T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (29, 249, N'Refactor module auth', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-01T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (30, 360, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-29T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (31, 693, N'Đào tạo nhân viên mới', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-23T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (32, 478, N'Cập nhật UI/UX', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-20T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (33, 175, N'Đánh giá hiệu năng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-19T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (34, 370, N'Viết tài liệu API', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-17T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (35, 173, N'Refactor module auth', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-05T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (36, 32, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-25T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (37, 278, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-11T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (38, 697, N'Test chức năng đăng nhập', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-02T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (39, 247, N'Chuẩn bị release note', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-13T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (40, 424, N'Cập nhật tài liệu', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-07T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (41, 314, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-12T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (42, 302, N'Họp nhóm dự án', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-18T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (43, 181, N'Xử lý ticket hỗ trợ', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-20T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (44, 376, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-30T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (45, 356, N'Refactor module auth', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-20T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (46, 58, N'Rà soát lỗi tồn đọng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-30T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (47, 379, N'Cập nhật UI/UX', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-05T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (48, 651, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-03T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (49, 32, N'Backup database', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-15T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (50, 695, N'Kiểm tra bảo mật', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-08T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (51, 10, N'Cập nhật UI/UX', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-30T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (52, 519, N'Họp sprint planning', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-02T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (53, 454, N'Họp nhóm dự án', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-27T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (54, 268, N'Test chức năng đăng nhập', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-20T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (55, 637, N'Kiểm tra log hệ thống', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-21T15:43:26.187' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (56, 447, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-19T15:43:26.187' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (57, 302, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-06T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (58, 593, N'Chuẩn bị release note', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-01T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (59, 544, N'Cập nhật tài liệu', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-02T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (60, 199, N'Họp với team design', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-21T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (61, 209, N'Fix bug production', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-04T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (62, 602, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-18T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (63, 642, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-04T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (64, 613, N'Chuẩn bị demo khách hàng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-10T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (65, 148, N'Viết báo cáo tuần', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-17T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (66, 670, N'Fix bug production', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-29T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (67, 592, N'Viết unit test', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-03T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (68, 132, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-16T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (69, 527, N'Xử lý ticket hỗ trợ', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-02T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (70, 391, N'Viết unit test', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-29T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (71, 424, N'Cập nhật UI/UX', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-14T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (72, 4, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-24T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (73, 322, N'Cập nhật UI/UX', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-19T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (74, 531, N'Viết tài liệu API', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-10T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (75, 493, N'Viết báo cáo tuần', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-19T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (76, 258, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-30T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (77, 212, N'Review code', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-07T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (78, 626, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-24T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (79, 136, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-19T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (80, 450, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-07T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (81, 319, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-18T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (82, 71, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-10T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (83, 193, N'Cập nhật UI/UX', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-03T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (84, 160, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-16T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (85, 206, N'Chuẩn bị release note', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-12T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (86, 134, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-03T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (87, 66, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-22T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (88, 144, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-25T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (89, 512, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-27T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (90, 302, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-26T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (91, 643, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-06T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (92, 700, N'Chuẩn bị release note', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-20T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (93, 443, N'Cập nhật tài liệu', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-21T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (94, 124, N'Họp với team design', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-03T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (95, 562, N'Backup database', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-05T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (96, 421, N'Họp với team design', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-07T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (97, 405, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-10T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (98, 367, N'Kiểm tra bảo mật', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-31T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (99, 428, N'Setup môi trường staging', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-10T15:43:26.190' AS DATETIME), 0);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (100, 593, N'Đào tạo nhân viên mới', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-16T15:43:26.190' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (101, 354, N'Họp với team design', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-11T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (102, 155, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-13T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (103, 688, N'Viết tài liệu API', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-21T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (104, 577, N'Đào tạo nhân viên mới', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-19T15:43:26.190' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (105, 550, N'Viết báo cáo tuần', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-06T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (106, 679, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-20T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (107, 29, N'Chuẩn bị demo khách hàng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-09T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (108, 545, N'Đào tạo nhân viên mới', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-07T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (109, 617, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-22T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (110, 90, N'Rà soát lỗi tồn đọng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-14T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (111, 566, N'Đánh giá hiệu năng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-12T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (112, 266, N'Setup môi trường staging', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-06T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (113, 248, N'Họp với team design', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-12T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (114, 165, N'Đánh giá hiệu năng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-06T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (115, 212, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-11T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (116, 406, N'Đánh giá hiệu năng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-28T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (117, 658, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-13T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (118, 160, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-01T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (119, 346, N'Viết báo cáo tuần', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-26T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (120, 148, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-26T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (121, 300, N'Cập nhật UI/UX', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-22T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (122, 265, N'Kiểm tra bảo mật', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-27T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (123, 526, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-21T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (124, 40, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-13T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (125, 162, N'Test chức năng đăng nhập', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-24T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (126, 437, N'Kiểm tra bảo mật', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-07T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (127, 627, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-16T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (128, 643, N'Viết tài liệu API', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-02T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (129, 692, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-13T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (130, 234, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-25T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (131, 44, N'Viết unit test', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-03T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (132, 530, N'Đào tạo nhân viên mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-09T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (133, 313, N'Chuẩn bị release note', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-09T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (134, 266, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-07T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (135, 78, N'Đào tạo nhân viên mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-27T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (136, 192, N'Tối ưu query chậm', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-05T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (137, 73, N'Họp với team design', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-16T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (138, 342, N'Fix bug production', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-26T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (139, 186, N'Viết tài liệu API', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-29T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (140, 119, N'Review code', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-29T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (141, 409, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-06T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (142, 403, N'Kiểm tra bảo mật', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-14T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (143, 190, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-18T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (144, 657, N'Rà soát lỗi tồn đọng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-23T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (145, 563, N'Cập nhật UI/UX', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-17T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (146, 573, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-27T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (147, 157, N'Rà soát lỗi tồn đọng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-23T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (148, 615, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-27T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (149, 104, N'Chuẩn bị demo khách hàng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-12T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (150, 348, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-03T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (151, 227, N'Chuẩn bị release note', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-07T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (152, 624, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-22T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (153, 533, N'Kiểm tra log hệ thống', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-18T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (154, 344, N'Kiểm tra bảo mật', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-11T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (155, 649, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-08T15:43:26.193' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (156, 138, N'Viết tài liệu API', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-06T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (157, 513, N'Cập nhật UI/UX', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-20T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (158, 148, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-03T15:43:26.193' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (159, 527, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-26T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (160, 44, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-28T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (161, 586, N'Deploy phiên bản mới', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-09T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (162, 514, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-12T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (163, 694, N'Cập nhật UI/UX', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-12T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (164, 676, N'Kiểm tra log hệ thống', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-23T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (165, 422, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-29T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (166, 287, N'Rà soát lỗi tồn đọng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-22T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (167, 418, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-29T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (168, 480, N'Cập nhật UI/UX', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-16T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (169, 127, N'Đánh giá hiệu năng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-21T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (170, 250, N'Kiểm tra log hệ thống', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-11T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (171, 81, N'Cập nhật UI/UX', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-04T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (172, 151, N'Cập nhật UI/UX', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-19T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (173, 252, N'Tối ưu query chậm', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-30T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (174, 285, N'Fix bug production', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-18T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (175, 624, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-20T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (176, 577, N'Chuẩn bị release note', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-12T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (177, 545, N'Đào tạo nhân viên mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-21T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (178, 582, N'Refactor module auth', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-08T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (179, 427, N'Rà soát lỗi tồn đọng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-26T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (180, 85, N'Rà soát lỗi tồn đọng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-04T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (181, 410, N'Họp với team design', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-07T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (182, 339, N'Setup môi trường staging', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-09T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (183, 508, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-10T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (184, 112, N'Cập nhật UI/UX', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-01T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (185, 251, N'Deploy phiên bản mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-07T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (186, 698, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-27T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (187, 8, N'Viết unit test', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-15T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (188, 487, N'Backup database', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-24T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (189, 589, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-07T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (190, 451, N'Viết báo cáo tuần', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-02T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (191, 281, N'Viết tài liệu API', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-21T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (192, 336, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-12T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (193, 184, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-15T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (194, 490, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-01T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (195, 304, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-24T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (196, 282, N'Test chức năng đăng nhập', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-08T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (197, 307, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-25T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (198, 87, N'Deploy phiên bản mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-04T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (199, 614, N'Viết unit test', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-27T15:43:26.197' AS DATETIME), 0);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (200, 353, N'Kiểm tra log hệ thống', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-19T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (201, 111, N'Họp sprint planning', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-18T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (202, 667, N'Tích hợp payment gateway', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-19T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (203, 348, N'Setup môi trường staging', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-12T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (204, 76, N'Refactor module auth', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-14T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (205, 228, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-09T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (206, 422, N'Đánh giá hiệu năng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-16T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (207, 419, N'Viết tài liệu API', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-05T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (208, 342, N'Tích hợp payment gateway', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-12T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (209, 314, N'Đánh giá hiệu năng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-07T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (210, 110, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-26T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (211, 676, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-28T15:43:26.197' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (212, 118, N'Họp nhóm dự án', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-02T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (213, 603, N'Refactor module auth', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-27T15:43:26.197' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (214, 577, N'Test chức năng đăng nhập', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-14T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (215, 485, N'Kiểm tra bảo mật', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-23T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (216, 286, N'Họp với team design', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-20T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (217, 217, N'Xử lý ticket hỗ trợ', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-31T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (218, 334, N'Cập nhật tài liệu', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-03T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (219, 197, N'Deploy phiên bản mới', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-12T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (220, 245, N'Kiểm tra log hệ thống', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-24T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (221, 541, N'Đánh giá hiệu năng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-04T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (222, 466, N'Refactor module auth', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-13T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (223, 603, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-19T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (224, 282, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-08T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (225, 116, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-13T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (226, 363, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-17T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (227, 684, N'Xử lý ticket hỗ trợ', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-08T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (228, 438, N'Đánh giá hiệu năng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-30T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (229, 141, N'Họp sprint planning', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-04T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (230, 519, N'Backup database', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-05T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (231, 92, N'Backup database', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-28T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (232, 166, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-01T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (233, 529, N'Rà soát lỗi tồn đọng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-10T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (234, 151, N'Đánh giá hiệu năng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-10T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (235, 68, N'Review code', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-28T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (236, 159, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-21T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (237, 416, N'Rà soát lỗi tồn đọng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-30T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (238, 627, N'Viết tài liệu API', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-06T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (239, 512, N'Rà soát lỗi tồn đọng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-27T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (240, 663, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-16T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (241, 145, N'Họp sprint planning', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-13T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (242, 478, N'Setup môi trường staging', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-04T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (243, 423, N'Rà soát lỗi tồn đọng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-17T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (244, 297, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-14T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (245, 122, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-29T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (246, 444, N'Viết unit test', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-28T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (247, 361, N'Test chức năng đăng nhập', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-02T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (248, 262, N'Tối ưu query chậm', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-27T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (249, 289, N'Đào tạo nhân viên mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-14T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (250, 175, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-15T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (251, 630, N'Backup database', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-19T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (252, 58, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-16T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (253, 135, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-10T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (254, 278, N'Tích hợp payment gateway', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-05T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (255, 633, N'Backup database', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-10T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (256, 669, N'Kiểm tra bảo mật', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-28T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (257, 611, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-10T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (258, 645, N'Kiểm tra log hệ thống', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-08T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (259, 276, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-25T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (260, 49, N'Fix bug production', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-08T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (261, 104, N'Đánh giá hiệu năng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-23T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (262, 70, N'Setup môi trường staging', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-17T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (263, 500, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-13T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (264, 668, N'Refactor module auth', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-05T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (265, 247, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-30T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (266, 422, N'Deploy phiên bản mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-04T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (267, 451, N'Đào tạo nhân viên mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-18T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (268, 96, N'Đào tạo nhân viên mới', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-05T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (269, 419, N'Họp với team design', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-02T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (270, 594, N'Viết unit test', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-09T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (271, 620, N'Cập nhật UI/UX', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-02T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (272, 118, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-30T15:43:26.200' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (273, 7, N'Chuẩn bị release note', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-11T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (274, 649, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-20T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (275, 458, N'Deploy phiên bản mới', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-30T15:43:26.200' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (276, 92, N'Kiểm tra bảo mật', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-30T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (277, 217, N'Viết báo cáo tuần', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-11T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (278, 443, N'Cập nhật tài liệu', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-16T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (279, 468, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-18T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (280, 681, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-14T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (281, 221, N'Review code', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-28T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (282, 331, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-10T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (283, 701, N'Backup database', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-17T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (284, 176, N'Setup môi trường staging', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-22T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (285, 160, N'Viết tài liệu API', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-26T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (286, 288, N'Cập nhật UI/UX', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-23T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (287, 664, N'Kiểm tra log hệ thống', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-21T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (288, 630, N'Đánh giá hiệu năng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-07T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (289, 545, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-10T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (290, 217, N'Viết báo cáo tuần', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-01T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (291, 157, N'Chuẩn bị release note', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-03T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (292, 241, N'Đào tạo nhân viên mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-21T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (293, 21, N'Backup database', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-07T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (294, 272, N'Backup database', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-08T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (295, 135, N'Họp sprint planning', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-28T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (296, 629, N'Refactor module auth', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-21T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (297, 549, N'Viết tài liệu API', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-25T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (298, 317, N'Refactor module auth', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-23T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (299, 634, N'Kiểm tra log hệ thống', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-04T15:43:26.203' AS DATETIME), 1);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (300, 205, N'Test chức năng đăng nhập', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-20T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (301, 498, N'Kiểm tra bảo mật', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-01T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (302, 403, N'Kiểm tra log hệ thống', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-17T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (303, 334, N'Đánh giá hiệu năng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-15T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (304, 423, N'Kiểm tra bảo mật', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-10T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (305, 270, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-08T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (306, 367, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-07T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (307, 701, N'Họp nhóm dự án', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-18T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (308, 376, N'Test chức năng đăng nhập', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-24T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (309, 693, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-19T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (310, 291, N'Họp với team design', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-12T15:43:26.203' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (311, 241, N'Họp với team design', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-20T15:43:26.203' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (312, 41, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-05T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (313, 174, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-14T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (314, 119, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-03T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (315, 100, N'Họp sprint planning', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-06T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (316, 382, N'Setup môi trường staging', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-21T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (317, 536, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-16T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (318, 339, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-08T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (319, 398, N'Chuẩn bị demo khách hàng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-17T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (320, 311, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-28T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (321, 572, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-07T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (322, 613, N'Cập nhật UI/UX', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-17T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (323, 357, N'Setup môi trường staging', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-16T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (324, 636, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-28T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (325, 364, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-07T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (326, 558, N'Họp sprint planning', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-17T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (327, 61, N'Đào tạo nhân viên mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-21T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (328, 341, N'Xử lý ticket hỗ trợ', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-10T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (329, 382, N'Họp với team design', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-03T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (330, 232, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-06T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (331, 270, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-27T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (332, 604, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-27T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (333, 172, N'Viết tài liệu API', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-17T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (334, 605, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-26T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (335, 112, N'Refactor module auth', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-04T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (336, 624, N'Họp sprint planning', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-20T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (337, 397, N'Setup môi trường staging', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-04T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (338, 176, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-10T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (339, 688, N'Test chức năng đăng nhập', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-20T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (340, 156, N'Rà soát lỗi tồn đọng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-07T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (341, 218, N'Chuẩn bị release note', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-21T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (342, 583, N'Cập nhật UI/UX', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-27T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (343, 327, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-06T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (344, 405, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-14T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (345, 440, N'Kiểm tra log hệ thống', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-19T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (346, 212, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-19T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (347, 683, N'Viết unit test', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-04T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (348, 104, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-11T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (349, 689, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-16T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (350, 63, N'Cập nhật tài liệu', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-05T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (351, 688, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-19T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (352, 213, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-03T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (353, 172, N'Cập nhật UI/UX', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-30T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (354, 96, N'Họp sprint planning', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-08T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (355, 541, N'Kiểm tra bảo mật', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-23T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (356, 454, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-02T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (357, 537, N'Đào tạo nhân viên mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-22T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (358, 644, N'Họp với team design', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-24T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (359, 507, N'Cập nhật tài liệu', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-29T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (360, 399, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-06T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (361, 286, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-26T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (362, 679, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-09T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (363, 507, N'Fix bug production', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-02T15:43:26.207' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (364, 518, N'Test chức năng đăng nhập', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-14T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (365, 142, N'Cập nhật UI/UX', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-27T15:43:26.207' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (366, 16, N'Cập nhật tài liệu', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-08T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (367, 453, N'Viết tài liệu API', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-17T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (368, 610, N'Đánh giá hiệu năng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-23T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (369, 569, N'Tích hợp payment gateway', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-09T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (370, 47, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-10T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (371, 456, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-10T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (372, 116, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-29T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (373, 631, N'Chuẩn bị demo khách hàng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-10T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (374, 260, N'Review code', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-27T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (375, 183, N'Fix bug production', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-06T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (376, 387, N'Test chức năng đăng nhập', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-18T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (377, 264, N'Setup môi trường staging', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-26T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (378, 403, N'Kiểm tra log hệ thống', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-07T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (379, 321, N'Backup database', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-12T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (380, 590, N'Đánh giá hiệu năng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-06T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (381, 530, N'Tích hợp payment gateway', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-20T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (382, 420, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-10T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (383, 184, N'Viết unit test', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-03T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (384, 434, N'Chuẩn bị demo khách hàng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-04T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (385, 233, N'Tối ưu query chậm', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-29T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (386, 396, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-16T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (387, 413, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-04T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (388, 350, N'Refactor module auth', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-05T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (389, 165, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-12T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (390, 326, N'Test chức năng đăng nhập', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-03T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (391, 200, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-12T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (392, 147, N'Deploy phiên bản mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-30T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (393, 74, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-06T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (394, 569, N'Rà soát lỗi tồn đọng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-11T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (395, 26, N'Đào tạo nhân viên mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-04T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (396, 418, N'Rà soát lỗi tồn đọng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-01T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (397, 397, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-06T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (398, 121, N'Họp sprint planning', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-13T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (399, 511, N'Cập nhật UI/UX', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-14T15:43:26.210' AS DATETIME), 0);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (400, 104, N'Kiểm tra log hệ thống', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-13T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (401, 162, N'Viết tài liệu API', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-29T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (402, 350, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-16T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (403, 533, N'Tích hợp payment gateway', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-04T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (404, 86, N'Setup môi trường staging', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-03T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (405, 695, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-25T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (406, 349, N'Backup database', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-30T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (407, 622, N'Viết tài liệu API', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-29T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (408, 214, N'Viết báo cáo tuần', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-14T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (409, 550, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-15T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (410, 515, N'Review code', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-08T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (411, 256, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-27T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (412, 482, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-12T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (413, 76, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-09T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (414, 494, N'Refactor module auth', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-30T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (415, 179, N'Chuẩn bị demo khách hàng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-30T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (416, 109, N'Deploy phiên bản mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-29T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (417, 219, N'Tối ưu query chậm', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-03T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (418, 443, N'Viết unit test', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-12T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (419, 313, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-13T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (420, 111, N'Cập nhật UI/UX', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-20T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (421, 563, N'Tối ưu query chậm', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-19T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (422, 539, N'Setup môi trường staging', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-05T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (423, 485, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-18T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (424, 630, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-24T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (425, 538, N'Rà soát lỗi tồn đọng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-19T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (426, 332, N'Deploy phiên bản mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-14T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (427, 561, N'Họp với team design', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-13T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (428, 689, N'Chuẩn bị release note', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-04T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (429, 508, N'Tích hợp payment gateway', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-23T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (430, 261, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-21T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (431, 174, N'Họp sprint planning', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-07T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (432, 545, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-23T15:43:26.210' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (433, 133, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-07T15:43:26.210' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (434, 46, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-21T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (435, 665, N'Viết báo cáo tuần', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-07T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (436, 7, N'Deploy phiên bản mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-03T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (437, 656, N'Xử lý ticket hỗ trợ', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-14T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (438, 232, N'Viết báo cáo tuần', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-13T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (439, 468, N'Cập nhật tài liệu', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-20T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (440, 9, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-30T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (441, 469, N'Chuẩn bị release note', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-03T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (442, 378, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-25T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (443, 497, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-26T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (444, 640, N'Đào tạo nhân viên mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-23T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (445, 221, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-15T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (446, 94, N'Kiểm tra log hệ thống', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-24T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (447, 527, N'Rà soát lỗi tồn đọng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-29T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (448, 369, N'Rà soát lỗi tồn đọng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-19T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (449, 316, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-15T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (450, 460, N'Deploy phiên bản mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-09T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (451, 29, N'Tích hợp payment gateway', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-02T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (452, 84, N'Test chức năng đăng nhập', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-08T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (453, 672, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-24T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (454, 549, N'Review code', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-06T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (455, 278, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-01T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (456, 525, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-09T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (457, 347, N'Chuẩn bị release note', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-16T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (458, 550, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-15T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (459, 182, N'Backup database', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-12T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (460, 455, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-02T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (461, 573, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-12T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (462, 343, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-21T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (463, 371, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-30T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (464, 470, N'Review code', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-14T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (465, 121, N'Cập nhật UI/UX', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-03T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (466, 527, N'Đào tạo nhân viên mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-29T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (467, 336, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-09T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (468, 404, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-21T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (469, 389, N'Setup môi trường staging', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-17T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (470, 580, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-19T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (471, 450, N'Xử lý ticket hỗ trợ', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-23T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (472, 661, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-11T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (473, 378, N'Họp nhóm dự án', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-08T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (474, 139, N'Tích hợp payment gateway', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-23T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (475, 367, N'Chuẩn bị demo khách hàng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-24T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (476, 109, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-25T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (477, 632, N'Tích hợp payment gateway', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-31T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (478, 493, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-24T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (479, 313, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-07T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (480, 360, N'Họp sprint planning', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-24T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (481, 633, N'Họp nhóm dự án', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-28T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (482, 568, N'Đào tạo nhân viên mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-16T15:43:26.213' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (483, 637, N'Đánh giá hiệu năng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-13T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (484, 652, N'Kiểm tra bảo mật', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-18T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (485, 491, N'Cập nhật UI/UX', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-04T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (486, 297, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-20T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (487, 573, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-22T15:43:26.213' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (488, 161, N'Backup database', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-07T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (489, 141, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-17T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (490, 496, N'Tối ưu query chậm', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-20T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (491, 541, N'Chuẩn bị release note', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-30T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (492, 210, N'Họp sprint planning', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-30T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (493, 86, N'Refactor module auth', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-06T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (494, 109, N'Cập nhật tài liệu', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-16T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (495, 142, N'Test chức năng đăng nhập', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-02T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (496, 59, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-09T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (497, 416, N'Xử lý ticket hỗ trợ', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-28T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (498, 201, N'Backup database', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-20T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (499, 44, N'Họp sprint planning', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-07T15:43:26.217' AS DATETIME), 1);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (500, 177, N'Viết tài liệu API', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-05T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (501, 639, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-27T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (502, 388, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-04T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (503, 535, N'Cập nhật UI/UX', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-02T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (504, 16, N'Cập nhật UI/UX', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-27T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (505, 192, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-10T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (506, 471, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-05T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (507, 212, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-09T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (508, 137, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-20T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (509, 587, N'Kiểm tra bảo mật', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-26T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (510, 511, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-15T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (511, 192, N'Họp với team design', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-11T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (512, 111, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-02T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (513, 214, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-20T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (514, 389, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-16T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (515, 447, N'Họp nhóm dự án', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-23T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (516, 303, N'Xử lý ticket hỗ trợ', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-25T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (517, 149, N'Chuẩn bị demo khách hàng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-15T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (518, 620, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-29T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (519, 573, N'Viết tài liệu API', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-18T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (520, 399, N'Test chức năng đăng nhập', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-08T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (521, 345, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-24T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (522, 157, N'Cập nhật tài liệu', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-04T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (523, 440, N'Họp nhóm dự án', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-20T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (524, 153, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-27T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (525, 308, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-29T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (526, 658, N'Rà soát lỗi tồn đọng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-18T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (527, 142, N'Deploy phiên bản mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-24T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (528, 448, N'Review code', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-25T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (529, 637, N'Xử lý ticket hỗ trợ', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-03T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (530, 267, N'Chuẩn bị demo khách hàng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-17T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (531, 673, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-05T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (532, 420, N'Đào tạo nhân viên mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-01T15:43:26.217' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (533, 91, N'Họp với team design', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-28T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (534, 259, N'Setup môi trường staging', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-15T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (535, 130, N'Deploy phiên bản mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-18T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (536, 296, N'Họp sprint planning', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-08T15:43:26.217' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (537, 157, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-13T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (538, 84, N'Refactor module auth', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-13T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (539, 678, N'Refactor module auth', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-01T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (540, 305, N'Họp nhóm dự án', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-26T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (541, 172, N'Backup database', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-18T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (542, 494, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-08T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (543, 642, N'Họp sprint planning', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-23T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (544, 338, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-27T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (545, 104, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-06T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (546, 382, N'Viết tài liệu API', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-01T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (547, 641, N'Refactor module auth', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-16T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (548, 192, N'Viết báo cáo tuần', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-12T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (549, 254, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-24T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (550, 692, N'Viết tài liệu API', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-22T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (551, 637, N'Họp sprint planning', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-24T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (552, 54, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-15T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (553, 347, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-22T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (554, 300, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-11T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (555, 279, N'Tối ưu query chậm', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-11T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (556, 93, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-28T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (557, 663, N'Tối ưu query chậm', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-22T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (558, 550, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-15T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (559, 123, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-04T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (560, 313, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-30T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (561, 146, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-16T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (562, 115, N'Chuẩn bị release note', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-07T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (563, 597, N'Cập nhật tài liệu', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-29T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (564, 544, N'Đánh giá hiệu năng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-15T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (565, 327, N'Backup database', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-04T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (566, 170, N'Đào tạo nhân viên mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-28T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (567, 109, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-09T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (568, 649, N'Viết unit test', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-01T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (569, 196, N'Refactor module auth', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-20T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (570, 227, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-10T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (571, 387, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-17T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (572, 344, N'Đánh giá hiệu năng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-30T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (573, 319, N'Rà soát lỗi tồn đọng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-23T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (574, 511, N'Setup môi trường staging', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-13T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (575, 612, N'Họp nhóm dự án', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-08T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (576, 309, N'Backup database', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-12T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (577, 614, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-19T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (578, 80, N'Cập nhật tài liệu', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-02T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (579, 547, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-14T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (580, 221, N'Họp với team design', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-19T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (581, 383, N'Fix bug production', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-19T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (582, 370, N'Backup database', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-06T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (583, 27, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-18T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (584, 466, N'Review code', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-06T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (585, 334, N'Rà soát lỗi tồn đọng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-12T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (586, 648, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-28T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (587, 93, N'Viết unit test', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-06T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (588, 226, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-14T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (589, 51, N'Viết unit test', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-13T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (590, 125, N'Viết tài liệu API', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-05T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (591, 61, N'Setup môi trường staging', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-01T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (592, 698, N'Review code', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-30T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (593, 348, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-04T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (594, 65, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-20T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (595, 696, N'Viết tài liệu API', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-03T15:43:26.220' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (596, 449, N'Review code', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-03T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (597, 458, N'Test chức năng đăng nhập', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-26T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (598, 450, N'Backup database', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-24T15:43:26.220' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (599, 546, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-06T15:43:26.220' AS DATETIME), 0);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (600, 499, N'Test chức năng đăng nhập', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-23T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (601, 232, N'Viết báo cáo tuần', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-02T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (602, 145, N'Kiểm tra bảo mật', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-22T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (603, 402, N'Tối ưu query chậm', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-08T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (604, 676, N'Họp với team design', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-13T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (605, 655, N'Chuẩn bị release note', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-27T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (606, 619, N'Rà soát lỗi tồn đọng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-02T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (607, 562, N'Đào tạo nhân viên mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-08T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (608, 44, N'Tối ưu query chậm', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-09T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (609, 353, N'Cập nhật UI/UX', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-15T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (610, 311, N'Cập nhật UI/UX', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-10T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (611, 563, N'Test chức năng đăng nhập', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-30T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (612, 550, N'Kiểm tra log hệ thống', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-22T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (613, 361, N'Deploy phiên bản mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-23T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (614, 672, N'Họp sprint planning', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-21T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (615, 617, N'Test chức năng đăng nhập', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-29T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (616, 683, N'Họp nhóm dự án', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-03T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (617, 267, N'Viết tài liệu API', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-20T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (618, 355, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-17T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (619, 169, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-15T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (620, 329, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-10T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (621, 271, N'Cập nhật tài liệu', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-02T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (622, 569, N'Đánh giá hiệu năng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-12T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (623, 650, N'Đào tạo nhân viên mới', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-06T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (624, 640, N'Review code', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-29T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (625, 250, N'Kiểm tra log hệ thống', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-06T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (626, 427, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-17T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (627, 112, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-08T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (628, 479, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-03T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (629, 672, N'Kiểm tra bảo mật', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-23T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (630, 330, N'Viết báo cáo tuần', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-23T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (631, 152, N'Chuẩn bị demo khách hàng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-23T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (632, 40, N'Chuẩn bị release note', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-13T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (633, 72, N'Rà soát lỗi tồn đọng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-16T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (634, 249, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-16T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (635, 582, N'Kiểm tra bảo mật', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-14T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (636, 513, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-19T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (637, 535, N'Tối ưu query chậm', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-15T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (638, 551, N'Deploy phiên bản mới', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-07T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (639, 372, N'Review code', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-11T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (640, 262, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-01T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (641, 391, N'Họp nhóm dự án', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-11T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (642, 284, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-20T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (643, 645, N'Backup database', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-08T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (644, 96, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-07T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (645, 264, N'Cập nhật tài liệu', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-18T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (646, 249, N'Đào tạo nhân viên mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-06T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (647, 29, N'Viết unit test', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-26T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (648, 354, N'Xử lý ticket hỗ trợ', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-12T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (649, 105, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-09T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (650, 437, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-24T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (651, 382, N'Kiểm tra bảo mật', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-31T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (652, 77, N'Fix bug production', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-21T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (653, 316, N'Cập nhật UI/UX', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-05T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (654, 443, N'Test chức năng đăng nhập', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-21T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (655, 470, N'Đào tạo nhân viên mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-06T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (656, 335, N'Xử lý ticket hỗ trợ', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-10T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (657, 210, N'Viết tài liệu API', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-22T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (658, 132, N'Họp với team design', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-13T15:43:26.223' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (659, 413, N'Tối ưu query chậm', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-28T15:43:26.223' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (660, 417, N'Fix bug production', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-02T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (661, 288, N'Cập nhật UI/UX', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-09T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (662, 695, N'Chuẩn bị demo khách hàng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-16T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (663, 112, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-04T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (664, 514, N'Cập nhật UI/UX', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-06T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (665, 492, N'Chuẩn bị demo khách hàng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-07T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (666, 345, N'Deploy phiên bản mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-08T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (667, 32, N'Rà soát lỗi tồn đọng', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-18T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (668, 646, N'Chuẩn bị release note', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-29T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (669, 3, N'Cập nhật tài liệu', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-17T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (670, 151, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-04T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (671, 342, N'Backup database', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-18T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (672, 441, N'Deploy phiên bản mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-04T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (673, 629, N'Họp với team design', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-14T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (674, 496, N'Đào tạo nhân viên mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-08T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (675, 102, N'Tích hợp payment gateway', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-05T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (676, 325, N'Tích hợp payment gateway', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-07T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (677, 340, N'Họp nhóm dự án', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-05T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (678, 83, N'Refactor module auth', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-23T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (679, 550, N'Viết tài liệu API', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-17T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (680, 342, N'Họp nhóm dự án', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-23T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (681, 693, N'Cập nhật UI/UX', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-26T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (682, 560, N'Chuẩn bị release note', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-03T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (683, 373, N'Xử lý ticket hỗ trợ', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-18T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (684, 401, N'Chuẩn bị release note', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-28T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (685, 482, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-07T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (686, 239, N'Họp sprint planning', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-16T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (687, 579, N'Review code', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-02T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (688, 309, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-28T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (689, 37, N'Chuẩn bị demo khách hàng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-29T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (690, 373, N'Viết unit test', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-06T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (691, 399, N'Họp với team design', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-18T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (692, 53, N'Cập nhật UI/UX', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-10T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (693, 300, N'Tích hợp payment gateway', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-21T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (694, 409, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-19T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (695, 282, N'Viết tài liệu API', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-28T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (696, 251, N'Chuẩn bị demo khách hàng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-09T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (697, 50, N'Rà soát lỗi tồn đọng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-15T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (698, 443, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-05T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (699, 94, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-07T15:43:26.227' AS DATETIME), 0);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (700, 173, N'Cập nhật UI/UX', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-03T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (701, 606, N'Cập nhật UI/UX', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-25T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (702, 498, N'Họp với team design', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-02T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (703, 143, N'Rà soát lỗi tồn đọng', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-11T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (704, 76, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-20T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (705, 672, N'Họp nhóm dự án', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-01T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (706, 146, N'Cập nhật tài liệu', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-04T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (707, 258, N'Xử lý ticket hỗ trợ', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-16T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (708, 387, N'Review code', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-05T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (709, 568, N'Viết tài liệu API', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-16T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (710, 116, N'Họp nhóm dự án', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-15T15:43:26.227' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (711, 595, N'Tối ưu query chậm', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-10T15:43:26.227' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (712, 612, N'Xử lý ticket hỗ trợ', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-09T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (713, 631, N'Test chức năng đăng nhập', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-15T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (714, 199, N'Chuẩn bị release note', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-28T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (715, 671, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-11-06T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (716, 687, N'Tích hợp payment gateway', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-24T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (717, 456, N'Họp sprint planning', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-12T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (718, 340, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-13T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (719, 600, N'Chuẩn bị release note', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-24T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (720, 423, N'Họp với team design', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-25T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (721, 297, N'Review code', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-20T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (722, 329, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-03T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (723, 223, N'Xử lý ticket hỗ trợ', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-21T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (724, 560, N'Fix bug production', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-08T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (725, 617, N'Kiểm tra log hệ thống', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-23T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (726, 99, N'Họp với team design', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-01T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (727, 71, N'Viết báo cáo tuần', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-24T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (728, 660, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-31T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (729, 184, N'Fix bug production', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-10T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (730, 445, N'Fix bug production', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-24T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (731, 58, N'Fix bug production', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-11T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (732, 557, N'Họp sprint planning', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-08T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (733, 298, N'Kiểm tra bảo mật', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-02T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (734, 668, N'Review code', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-29T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (735, 453, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-05T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (736, 546, N'Viết tài liệu API', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-07T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (737, 487, N'Chuẩn bị release note', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-26T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (738, 146, N'Tích hợp payment gateway', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-11T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (739, 31, N'Setup môi trường staging', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-09-24T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (740, 88, N'Test chức năng đăng nhập', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-27T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (741, 524, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-01T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (742, 505, N'Setup môi trường staging', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-14T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (743, 541, N'Backup database', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-04T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (744, 480, N'Setup môi trường staging', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-30T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (745, 30, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-04T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (746, 94, N'Setup môi trường staging', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-04T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (747, 177, N'Refactor module auth', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-11-04T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (748, 644, N'Đánh giá hiệu năng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-04T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (749, 372, N'Deploy phiên bản mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-10-03T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (750, 206, N'Test chức năng đăng nhập', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-25T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (751, 335, N'Kiểm tra log hệ thống', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-22T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (752, 343, N'Setup môi trường staging', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-22T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (753, 157, N'Chuẩn bị release note', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-08T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (754, 322, N'Kiểm tra bảo mật', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-21T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (755, 275, N'Chuẩn bị demo khách hàng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-10T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (756, 450, N'Refactor module auth', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-16T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (757, 179, N'Cập nhật tài liệu', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-12T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (758, 648, N'Xử lý ticket hỗ trợ', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-22T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (759, 578, N'Cập nhật UI/UX', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-02T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (760, 410, N'Đánh giá hiệu năng', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-19T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (761, 516, N'Rà soát lỗi tồn đọng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-09-28T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (762, 500, N'Họp nhóm dự án', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-20T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (763, 238, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-11-09T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (764, 172, N'Refactor module auth', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-18T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (765, 695, N'Họp nhóm dự án', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-13T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (766, 232, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-08T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (767, 417, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-16T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (768, 417, N'Review code', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-10-06T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (769, 683, N'Viết tài liệu API', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-10-28T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (770, 349, N'Cập nhật tài liệu', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-09-12T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (771, 691, N'Viết unit test', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-20T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (772, 546, N'Review code', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-19T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (773, 475, N'Đào tạo nhân viên mới', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-19T15:43:26.230' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (774, 275, N'Đánh giá hiệu năng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-30T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (775, 642, N'Đánh giá hiệu năng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-22T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (776, 128, N'Đào tạo nhân viên mới', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-30T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (777, 426, N'Chuẩn bị release note', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-01T15:43:26.230' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (778, 126, N'Họp nhóm dự án', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-11-10T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (779, 92, N'Viết báo cáo tuần', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-09T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (780, 310, N'Backup database', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-19T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (781, 243, N'Deploy phiên bản mới', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-11-04T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (782, 21, N'Cập nhật tài liệu', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-11-08T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (783, 618, N'Review code', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-14T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (784, 662, N'Rà soát lỗi tồn đọng', N'Cập nhật tiến độ lên hệ thống quản lý.', CAST (N'2026-09-30T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (785, 429, N'Kiểm tra log hệ thống', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-05T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (786, 149, N'Tích hợp payment gateway', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-24T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (787, 579, N'Deploy phiên bản mới', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-10-26T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (788, 96, N'Họp sprint planning', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-16T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (789, 406, N'Chuẩn bị release note', N'Ghi chú lại các vấn đề phát sinh.', CAST (N'2026-11-09T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (790, 42, N'Đánh giá hiệu năng', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-21T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (791, 447, N'Kiểm tra bảo mật', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-28T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (792, 601, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-19T15:43:26.233' AS DATETIME), 0);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (793, 189, N'Chuẩn bị release note', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-13T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (794, 339, N'Tối ưu query chậm', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-12T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (795, 309, N'Fix bug production', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-10-12T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (796, 241, N'Kiểm tra bảo mật', N'Kiểm tra kỹ trước khi bàn giao.', CAST (N'2026-10-20T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (797, 34, N'Đánh giá hiệu năng', N'Đảm bảo chất lượng theo tiêu chuẩn công ty.', CAST (N'2026-09-20T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (798, 267, N'Chuẩn bị demo khách hàng', N'Ưu tiên cao, xử lý trong ngày.', CAST (N'2026-10-06T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (799, 605, N'Viết báo cáo tuần', N'Cần hoàn thành đúng hạn và báo cáo lại cho quản lý.', CAST (N'2026-09-28T15:43:26.233' AS DATETIME), 1);


GO
INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (800, 282, N'Họp sprint planning', N'Phối hợp với team liên quan để hoàn thành.', CAST (N'2026-09-24T15:43:26.233' AS DATETIME), 1);

INSERT	[dbo].[CongViec] (
	[ID],
	[UserID],
	[Ten],
	[Mota],
	[HetHan],
	[TrangThai]
)
VALUES                   (801, 2, N'1', N'2', CAST (N'2026-10-15T04:01:00.000' AS DATETIME), 0);

SET IDENTITY_INSERT [dbo].[CongViec] OFF;


GO
SET IDENTITY_INSERT [dbo].[Roles] ON;

INSERT	[dbo].[Roles] (
	[Id],
	[RoleName]
)
VALUES                (1, N'Người dùng');

INSERT	[dbo].[Roles] (
	[Id],
	[RoleName]
)
VALUES                (2, N'Admin');

SET IDENTITY_INSERT [dbo].[Roles] OFF;


GO
SET IDENTITY_INSERT [dbo].[User] ON;

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (1, N'Admin', N'admin@gmail.com', N'0900000000', 2, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (2, N'Lương Sơn', N'user0001@gmail.com', N'0000000001', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (3, N'Mai Minh', N'user0002@gmail.com', N'0000000002', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (4, N'Lê Tâm', N'user0003@gmail.com', N'0000000003', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (5, N'Lương Duy', N'user0004@gmail.com', N'0000000004', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (6, N'Hồ Thảo', N'user0005@gmail.com', N'0000000005', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (7, N'Đặng Yến', N'user0006@gmail.com', N'0000000006', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (8, N'Võ Hà', N'user0007@gmail.com', N'0000000007', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (9, N'Lê Hùng', N'user0008@gmail.com', N'0000000008', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (10, N'Hồ Khánh', N'user0009@gmail.com', N'0000000009', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (11, N'Trịnh Nam', N'user0010@gmail.com', N'0000000010', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (12, N'Dương Ngọc', N'user0011@gmail.com', N'0000000011', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (13, N'Lê Yến', N'user0012@gmail.com', N'0000000012', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (14, N'Đinh Thu', N'user0013@gmail.com', N'0000000013', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (15, N'Vũ An', N'user0014@gmail.com', N'0000000014', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (16, N'Hoàng Khánh', N'user0015@gmail.com', N'0000000015', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (17, N'Lương Nam', N'user0016@gmail.com', N'0000000016', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (18, N'Đinh Thủy', N'user0017@gmail.com', N'0000000017', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (19, N'Hoàng Vân', N'user0018@gmail.com', N'0000000018', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (20, N'Lương An', N'user0019@gmail.com', N'0000000019', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (21, N'Đinh Đạt', N'user0020@gmail.com', N'0000000020', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (22, N'Trần Mai', N'user0021@gmail.com', N'0000000021', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (23, N'Tô Minh', N'user0022@gmail.com', N'0000000022', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (24, N'Lý Phong', N'user0023@gmail.com', N'0000000023', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (25, N'Võ Phát', N'user0024@gmail.com', N'0000000024', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (26, N'Bùi Hải', N'user0025@gmail.com', N'0000000025', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (27, N'Phạm Minh', N'user0026@gmail.com', N'0000000026', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (28, N'Trịnh Minh', N'user0027@gmail.com', N'0000000027', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (29, N'Đỗ Nga', N'user0028@gmail.com', N'0000000028', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (30, N'Lê Long', N'user0029@gmail.com', N'0000000029', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (31, N'Hoàng Hà', N'user0030@gmail.com', N'0000000030', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (32, N'Dương Vy', N'user0031@gmail.com', N'0000000031', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (33, N'Dương Long', N'user0032@gmail.com', N'0000000032', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (34, N'Đinh Phúc', N'user0033@gmail.com', N'0000000033', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (35, N'Vũ Nam', N'user0034@gmail.com', N'0000000034', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (36, N'Nguyễn Phong', N'user0035@gmail.com', N'0000000035', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (37, N'Đỗ Cường', N'user0036@gmail.com', N'0000000036', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (38, N'Tô Phát', N'user0037@gmail.com', N'0000000037', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (39, N'Vũ Thảo', N'user0038@gmail.com', N'0000000038', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (40, N'Dương Khang', N'user0039@gmail.com', N'0000000039', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (41, N'Trịnh Hiếu', N'user0040@gmail.com', N'0000000040', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (42, N'Đỗ Nga', N'user0041@gmail.com', N'0000000041', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (43, N'Đỗ Nhung', N'user0042@gmail.com', N'0000000042', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (44, N'Tô Phúc', N'user0043@gmail.com', N'0000000043', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (45, N'Trần Hằng', N'user0044@gmail.com', N'0000000044', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (46, N'Hoàng Dũng', N'user0045@gmail.com', N'0000000045', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (47, N'Đinh Nghĩa', N'user0046@gmail.com', N'0000000046', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (48, N'Đặng Nhung', N'user0047@gmail.com', N'0000000047', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (49, N'Vũ Long', N'user0048@gmail.com', N'0000000048', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (50, N'Hoàng Thu', N'user0049@gmail.com', N'0000000049', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (51, N'Võ Tuấn', N'user0050@gmail.com', N'0000000050', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (52, N'Trần Mai', N'user0051@gmail.com', N'0000000051', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (53, N'Ngô Linh', N'user0052@gmail.com', N'0000000052', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (54, N'Hồ Thảo', N'user0053@gmail.com', N'0000000053', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (55, N'Trịnh Minh', N'user0054@gmail.com', N'0000000054', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (56, N'Phạm Nhung', N'user0055@gmail.com', N'0000000055', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (57, N'Nguyễn Khang', N'user0056@gmail.com', N'0000000056', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (58, N'Ngô Vy', N'user0057@gmail.com', N'0000000057', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (59, N'Mai Anh', N'user0058@gmail.com', N'0000000058', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (60, N'Trần Tùng', N'user0059@gmail.com', N'0000000059', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (61, N'Lê Việt', N'user0060@gmail.com', N'0000000060', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (62, N'Hoàng Thiện', N'user0061@gmail.com', N'0000000061', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (63, N'Lê Hằng', N'user0062@gmail.com', N'0000000062', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (64, N'Vũ Phát', N'user0063@gmail.com', N'0000000063', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (65, N'Lý Phát', N'user0064@gmail.com', N'0000000064', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (66, N'Nguyễn Thiện', N'user0065@gmail.com', N'0000000065', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (67, N'Đặng Việt', N'user0066@gmail.com', N'0000000066', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (68, N'Vũ Phát', N'user0067@gmail.com', N'0000000067', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (69, N'Vũ Sơn', N'user0068@gmail.com', N'0000000068', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (70, N'Vũ Mai', N'user0069@gmail.com', N'0000000069', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (71, N'Võ Bảo', N'user0070@gmail.com', N'0000000070', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (72, N'Hồ Hương', N'user0071@gmail.com', N'0000000071', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (73, N'Lương Thiện', N'user0072@gmail.com', N'0000000072', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (74, N'Phạm Bình', N'user0073@gmail.com', N'0000000073', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (75, N'Đỗ Tuấn', N'user0074@gmail.com', N'0000000074', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (76, N'Vũ Hiếu', N'user0075@gmail.com', N'0000000075', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (77, N'Trịnh Long', N'user0076@gmail.com', N'0000000076', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (78, N'Mai Phát', N'user0077@gmail.com', N'0000000077', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (79, N'Nguyễn Phát', N'user0078@gmail.com', N'0000000078', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (80, N'Nguyễn Bảo', N'user0079@gmail.com', N'0000000079', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (81, N'Võ Đạt', N'user0080@gmail.com', N'0000000080', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (82, N'Ngô Vy', N'user0081@gmail.com', N'0000000081', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (83, N'Đinh Giang', N'user0082@gmail.com', N'0000000082', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (84, N'Lê Mai', N'user0083@gmail.com', N'0000000083', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (85, N'Mai Khang', N'user0084@gmail.com', N'0000000084', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (86, N'Đặng Duy', N'user0085@gmail.com', N'0000000085', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (87, N'Dương Anh', N'user0086@gmail.com', N'0000000086', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (88, N'Bùi Anh', N'user0087@gmail.com', N'0000000087', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (89, N'Hoàng Phát', N'user0088@gmail.com', N'0000000088', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (90, N'Phan Việt', N'user0089@gmail.com', N'0000000089', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (91, N'Võ Hà', N'user0090@gmail.com', N'0000000090', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (92, N'Hồ Phong', N'user0091@gmail.com', N'0000000091', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (93, N'Nguyễn Hà', N'user0092@gmail.com', N'0000000092', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (94, N'Dương Ngọc', N'user0093@gmail.com', N'0000000093', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (95, N'Bùi Khang', N'user0094@gmail.com', N'0000000094', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (96, N'Lý Tuấn', N'user0095@gmail.com', N'0000000095', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (97, N'Lý Linh', N'user0096@gmail.com', N'0000000096', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (98, N'Trần Dũng', N'user0097@gmail.com', N'0000000097', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (99, N'Hồ Hà', N'user0098@gmail.com', N'0000000098', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (100, N'Hồ Hương', N'user0099@gmail.com', N'0000000099', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (101, N'Nguyễn Thiện', N'user0100@gmail.com', N'0000000100', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (102, N'Phạm Giang', N'user0101@gmail.com', N'0000000101', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (103, N'Đặng Yến', N'user0102@gmail.com', N'0000000102', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (104, N'Tô Minh', N'user0103@gmail.com', N'0000000103', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (105, N'Bùi Phúc', N'user0104@gmail.com', N'0000000104', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (106, N'Phạm Châu', N'user0105@gmail.com', N'0000000105', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (107, N'Hồ Việt', N'user0106@gmail.com', N'0000000106', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (108, N'Đặng Vy', N'user0107@gmail.com', N'0000000107', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (109, N'Dương Tùng', N'user0108@gmail.com', N'0000000108', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (110, N'Tô Sơn', N'user0109@gmail.com', N'0000000109', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (111, N'Nguyễn Hiếu', N'user0110@gmail.com', N'0000000110', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (112, N'Hồ Bình', N'user0111@gmail.com', N'0000000111', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (113, N'Dương Giang', N'user0112@gmail.com', N'0000000112', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (114, N'Lê An', N'user0113@gmail.com', N'0000000113', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (115, N'Phạm Cường', N'user0114@gmail.com', N'0000000114', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (116, N'Phạm Vân', N'user0115@gmail.com', N'0000000115', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (117, N'Lương Phong', N'user0116@gmail.com', N'0000000116', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (118, N'Phạm Khánh', N'user0117@gmail.com', N'0000000117', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (119, N'Võ Anh', N'user0118@gmail.com', N'0000000118', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (120, N'Hoàng Ngọc', N'user0119@gmail.com', N'0000000119', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (121, N'Nguyễn Hằng', N'user0120@gmail.com', N'0000000120', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (122, N'Hồ Thiện', N'user0121@gmail.com', N'0000000121', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (123, N'Vũ Khang', N'user0122@gmail.com', N'0000000122', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (124, N'Trần Hiếu', N'user0123@gmail.com', N'0000000123', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (125, N'Mai Châu', N'user0124@gmail.com', N'0000000124', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (126, N'Vũ Giang', N'user0125@gmail.com', N'0000000125', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (127, N'Hoàng Lan', N'user0126@gmail.com', N'0000000126', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (128, N'Lương Hằng', N'user0127@gmail.com', N'0000000127', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (129, N'Đỗ Bảo', N'user0128@gmail.com', N'0000000128', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (130, N'Phan Quân', N'user0129@gmail.com', N'0000000129', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (131, N'Trần Châu', N'user0130@gmail.com', N'0000000130', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (132, N'Trần Phúc', N'user0131@gmail.com', N'0000000131', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (133, N'Lương Việt', N'user0132@gmail.com', N'0000000132', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (134, N'Mai Thắng', N'user0133@gmail.com', N'0000000133', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (135, N'Tô Hùng', N'user0134@gmail.com', N'0000000134', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (136, N'Hoàng Sơn', N'user0135@gmail.com', N'0000000135', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (137, N'Lương Duy', N'user0136@gmail.com', N'0000000136', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (138, N'Dương Nghĩa', N'user0137@gmail.com', N'0000000137', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (139, N'Lương Nga', N'user0138@gmail.com', N'0000000138', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (140, N'Đinh Giang', N'user0139@gmail.com', N'0000000139', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (141, N'Lê Nam', N'user0140@gmail.com', N'0000000140', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (142, N'Nguyễn Bình', N'user0141@gmail.com', N'0000000141', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (143, N'Hoàng Phúc', N'user0142@gmail.com', N'0000000142', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (144, N'Hoàng Cường', N'user0143@gmail.com', N'0000000143', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (145, N'Hoàng Phúc', N'user0144@gmail.com', N'0000000144', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (146, N'Mai Thủy', N'user0145@gmail.com', N'0000000145', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (147, N'Lương Vy', N'user0146@gmail.com', N'0000000146', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (148, N'Bùi Giang', N'user0147@gmail.com', N'0000000147', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (149, N'Đinh Việt', N'user0148@gmail.com', N'0000000148', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (150, N'Mai Hà', N'user0149@gmail.com', N'0000000149', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (151, N'Nguyễn Tuấn', N'user0150@gmail.com', N'0000000150', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (152, N'Mai Thủy', N'user0151@gmail.com', N'0000000151', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (153, N'Phan Nhung', N'user0152@gmail.com', N'0000000152', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (154, N'Đặng Phong', N'user0153@gmail.com', N'0000000153', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (155, N'Đinh Việt', N'user0154@gmail.com', N'0000000154', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (156, N'Đặng Hà', N'user0155@gmail.com', N'0000000155', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (157, N'Võ Vy', N'user0156@gmail.com', N'0000000156', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (158, N'Trịnh Quân', N'user0157@gmail.com', N'0000000157', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (159, N'Vũ Phúc', N'user0158@gmail.com', N'0000000158', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (160, N'Phạm Khang', N'user0159@gmail.com', N'0000000159', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (161, N'Lý Khang', N'user0160@gmail.com', N'0000000160', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (162, N'Dương Quân', N'user0161@gmail.com', N'0000000161', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (163, N'Vũ Vân', N'user0162@gmail.com', N'0000000162', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (164, N'Hoàng Giang', N'user0163@gmail.com', N'0000000163', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (165, N'Lương Anh', N'user0164@gmail.com', N'0000000164', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (166, N'Tô Hùng', N'user0165@gmail.com', N'0000000165', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (167, N'Phan Quân', N'user0166@gmail.com', N'0000000166', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (168, N'Lý Minh', N'user0167@gmail.com', N'0000000167', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (169, N'Trịnh Nhung', N'user0168@gmail.com', N'0000000168', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (170, N'Lê Khánh', N'user0169@gmail.com', N'0000000169', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (171, N'Trịnh Linh', N'user0170@gmail.com', N'0000000170', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (172, N'Ngô Châu', N'user0171@gmail.com', N'0000000171', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (173, N'Đặng Quỳnh', N'user0172@gmail.com', N'0000000172', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (174, N'Đinh Linh', N'user0173@gmail.com', N'0000000173', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (175, N'Mai Vân', N'user0174@gmail.com', N'0000000174', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (176, N'Nguyễn Vy', N'user0175@gmail.com', N'0000000175', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (177, N'Lương Nghĩa', N'user0176@gmail.com', N'0000000176', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (178, N'Bùi Nhung', N'user0177@gmail.com', N'0000000177', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (179, N'Hoàng Đạt', N'user0178@gmail.com', N'0000000178', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (180, N'Lý Đạt', N'user0179@gmail.com', N'0000000179', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (181, N'Bùi Phong', N'user0180@gmail.com', N'0000000180', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (182, N'Đỗ Quỳnh', N'user0181@gmail.com', N'0000000181', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (183, N'Hoàng Nghĩa', N'user0182@gmail.com', N'0000000182', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (184, N'Phạm Phong', N'user0183@gmail.com', N'0000000183', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (185, N'Phan Anh', N'user0184@gmail.com', N'0000000184', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (186, N'Hoàng Thủy', N'user0185@gmail.com', N'0000000185', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (187, N'Phạm Sơn', N'user0186@gmail.com', N'0000000186', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (188, N'Đặng Thiện', N'user0187@gmail.com', N'0000000187', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (189, N'Hoàng Nghĩa', N'user0188@gmail.com', N'0000000188', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (190, N'Mai Quân', N'user0189@gmail.com', N'0000000189', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (191, N'Lê Châu', N'user0190@gmail.com', N'0000000190', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (192, N'Đặng Giang', N'user0191@gmail.com', N'0000000191', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (193, N'Dương Quỳnh', N'user0192@gmail.com', N'0000000192', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (194, N'Phạm Châu', N'user0193@gmail.com', N'0000000193', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (195, N'Vũ Quân', N'user0194@gmail.com', N'0000000194', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (196, N'Đinh Minh', N'user0195@gmail.com', N'0000000195', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (197, N'Lý Thủy', N'user0196@gmail.com', N'0000000196', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (198, N'Hoàng Bình', N'user0197@gmail.com', N'0000000197', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (199, N'Mai Phong', N'user0198@gmail.com', N'0000000198', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (200, N'Ngô Minh', N'user0199@gmail.com', N'0000000199', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (201, N'Hoàng Nam', N'user0200@gmail.com', N'0000000200', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (202, N'Võ Sơn', N'user0201@gmail.com', N'0000000201', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (203, N'Dương Long', N'user0202@gmail.com', N'0000000202', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (204, N'Lý Hiếu', N'user0203@gmail.com', N'0000000203', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (205, N'Đỗ Linh', N'user0204@gmail.com', N'0000000204', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (206, N'Dương Châu', N'user0205@gmail.com', N'0000000205', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (207, N'Lương Tuấn', N'user0206@gmail.com', N'0000000206', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (208, N'Lương Khang', N'user0207@gmail.com', N'0000000207', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (209, N'Bùi Hương', N'user0208@gmail.com', N'0000000208', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (210, N'Nguyễn Vân', N'user0209@gmail.com', N'0000000209', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (211, N'Đinh Việt', N'user0210@gmail.com', N'0000000210', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (212, N'Ngô Phúc', N'user0211@gmail.com', N'0000000211', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (213, N'Đặng Phát', N'user0212@gmail.com', N'0000000212', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (214, N'Trịnh Giang', N'user0213@gmail.com', N'0000000213', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (215, N'Hoàng Long', N'user0214@gmail.com', N'0000000214', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (216, N'Ngô Phúc', N'user0215@gmail.com', N'0000000215', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (217, N'Lương Tuấn', N'user0216@gmail.com', N'0000000216', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (218, N'Võ Nga', N'user0217@gmail.com', N'0000000217', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (219, N'Đỗ Phong', N'user0218@gmail.com', N'0000000218', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (220, N'Dương Vân', N'user0219@gmail.com', N'0000000219', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (221, N'Phạm Sơn', N'user0220@gmail.com', N'0000000220', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (222, N'Ngô Thảo', N'user0221@gmail.com', N'0000000221', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (223, N'Hoàng Giang', N'user0222@gmail.com', N'0000000222', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (224, N'Bùi Phong', N'user0223@gmail.com', N'0000000223', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (225, N'Lê Châu', N'user0224@gmail.com', N'0000000224', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (226, N'Nguyễn Thiện', N'user0225@gmail.com', N'0000000225', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (227, N'Phan Hiếu', N'user0226@gmail.com', N'0000000226', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (228, N'Dương Thiện', N'user0227@gmail.com', N'0000000227', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (229, N'Đỗ Long', N'user0228@gmail.com', N'0000000228', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (230, N'Võ Thiện', N'user0229@gmail.com', N'0000000229', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (231, N'Nguyễn Tùng', N'user0230@gmail.com', N'0000000230', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (232, N'Ngô Tùng', N'user0231@gmail.com', N'0000000231', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (233, N'Bùi Vy', N'user0232@gmail.com', N'0000000232', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (234, N'Ngô Tuấn', N'user0233@gmail.com', N'0000000233', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (235, N'Lý Minh', N'user0234@gmail.com', N'0000000234', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (236, N'Hồ Hiếu', N'user0235@gmail.com', N'0000000235', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (237, N'Trần Nga', N'user0236@gmail.com', N'0000000236', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (238, N'Lương Vy', N'user0237@gmail.com', N'0000000237', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (239, N'Phạm Phúc', N'user0238@gmail.com', N'0000000238', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (240, N'Hồ An', N'user0239@gmail.com', N'0000000239', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (241, N'Hoàng Phúc', N'user0240@gmail.com', N'0000000240', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (242, N'Đinh Hải', N'user0241@gmail.com', N'0000000241', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (243, N'Hoàng Ngọc', N'user0242@gmail.com', N'0000000242', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (244, N'Nguyễn Thiện', N'user0243@gmail.com', N'0000000243', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (245, N'Lương Bảo', N'user0244@gmail.com', N'0000000244', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (246, N'Hoàng Hà', N'user0245@gmail.com', N'0000000245', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (247, N'Hồ Nam', N'user0246@gmail.com', N'0000000246', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (248, N'Võ Tùng', N'user0247@gmail.com', N'0000000247', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (249, N'Đặng Châu', N'user0248@gmail.com', N'0000000248', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (250, N'Tô Sơn', N'user0249@gmail.com', N'0000000249', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (251, N'Trần Thảo', N'user0250@gmail.com', N'0000000250', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (252, N'Lý Tiến', N'user0251@gmail.com', N'0000000251', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (253, N'Nguyễn Vân', N'user0252@gmail.com', N'0000000252', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (254, N'Võ Yến', N'user0253@gmail.com', N'0000000253', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (255, N'Lương Thắng', N'user0254@gmail.com', N'0000000254', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (256, N'Võ Thảo', N'user0255@gmail.com', N'0000000255', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (257, N'Ngô Long', N'user0256@gmail.com', N'0000000256', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (258, N'Phan Châu', N'user0257@gmail.com', N'0000000257', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (259, N'Nguyễn Tùng', N'user0258@gmail.com', N'0000000258', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (260, N'Đặng Duy', N'user0259@gmail.com', N'0000000259', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (261, N'Vũ Hải', N'user0260@gmail.com', N'0000000260', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (262, N'Vũ Tùng', N'user0261@gmail.com', N'0000000261', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (263, N'Phan Long', N'user0262@gmail.com', N'0000000262', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (264, N'Đinh Mai', N'user0263@gmail.com', N'0000000263', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (265, N'Tô Khang', N'user0264@gmail.com', N'0000000264', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (266, N'Võ Yến', N'user0265@gmail.com', N'0000000265', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (267, N'Lê Vân', N'user0266@gmail.com', N'0000000266', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (268, N'Phạm Hải', N'user0267@gmail.com', N'0000000267', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (269, N'Đinh Quân', N'user0268@gmail.com', N'0000000268', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (270, N'Dương Việt', N'user0269@gmail.com', N'0000000269', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (271, N'Tô Quỳnh', N'user0270@gmail.com', N'0000000270', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (272, N'Đỗ Đạt', N'user0271@gmail.com', N'0000000271', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (273, N'Trần Phong', N'user0272@gmail.com', N'0000000272', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (274, N'Đỗ Quân', N'user0273@gmail.com', N'0000000273', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (275, N'Võ Vy', N'user0274@gmail.com', N'0000000274', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (276, N'Lý Thu', N'user0275@gmail.com', N'0000000275', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (277, N'Đinh Cường', N'user0276@gmail.com', N'0000000276', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (278, N'Hoàng Đạt', N'user0277@gmail.com', N'0000000277', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (279, N'Hồ Thủy', N'user0278@gmail.com', N'0000000278', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (280, N'Võ Thảo', N'user0279@gmail.com', N'0000000279', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (281, N'Đỗ Duy', N'user0280@gmail.com', N'0000000280', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (282, N'Phạm Thu', N'user0281@gmail.com', N'0000000281', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (283, N'Trần Tuấn', N'user0282@gmail.com', N'0000000282', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (284, N'Tô Đạt', N'user0283@gmail.com', N'0000000283', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (285, N'Tô Tâm', N'user0284@gmail.com', N'0000000284', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (286, N'Dương Linh', N'user0285@gmail.com', N'0000000285', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (287, N'Nguyễn Mai', N'user0286@gmail.com', N'0000000286', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (288, N'Mai Hương', N'user0287@gmail.com', N'0000000287', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (289, N'Mai Vy', N'user0288@gmail.com', N'0000000288', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (290, N'Trần Nam', N'user0289@gmail.com', N'0000000289', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (291, N'Lý Phúc', N'user0290@gmail.com', N'0000000290', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (292, N'Võ Dũng', N'user0291@gmail.com', N'0000000291', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (293, N'Đặng Nhung', N'user0292@gmail.com', N'0000000292', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (294, N'Hoàng Yến', N'user0293@gmail.com', N'0000000293', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (295, N'Trịnh Vy', N'user0294@gmail.com', N'0000000294', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (296, N'Lương Thủy', N'user0295@gmail.com', N'0000000295', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (297, N'Lương Nga', N'user0296@gmail.com', N'0000000296', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (298, N'Dương Cường', N'user0297@gmail.com', N'0000000297', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (299, N'Lê Châu', N'user0298@gmail.com', N'0000000298', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (300, N'Phạm Tuấn', N'user0299@gmail.com', N'0000000299', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (301, N'Lý Đạt', N'user0300@gmail.com', N'0000000300', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (302, N'Lý Quân', N'user0301@gmail.com', N'0000000301', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (303, N'Mai Hương', N'user0302@gmail.com', N'0000000302', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (304, N'Lý Yến', N'user0303@gmail.com', N'0000000303', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (305, N'Nguyễn Mai', N'user0304@gmail.com', N'0000000304', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (306, N'Hồ Yến', N'user0305@gmail.com', N'0000000305', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (307, N'Lương Hùng', N'user0306@gmail.com', N'0000000306', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (308, N'Lương Phong', N'user0307@gmail.com', N'0000000307', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (309, N'Đặng Vân', N'user0308@gmail.com', N'0000000308', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (310, N'Phan Phát', N'user0309@gmail.com', N'0000000309', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (311, N'Vũ Thắng', N'user0310@gmail.com', N'0000000310', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (312, N'Vũ Nga', N'user0311@gmail.com', N'0000000311', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (313, N'Đinh Hương', N'user0312@gmail.com', N'0000000312', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (314, N'Hoàng Nam', N'user0313@gmail.com', N'0000000313', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (315, N'Bùi Hải', N'user0314@gmail.com', N'0000000314', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (316, N'Lương Việt', N'user0315@gmail.com', N'0000000315', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (317, N'Lương Hương', N'user0316@gmail.com', N'0000000316', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (318, N'Đặng Tiến', N'user0317@gmail.com', N'0000000317', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (319, N'Hồ Nghĩa', N'user0318@gmail.com', N'0000000318', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (320, N'Dương Duy', N'user0319@gmail.com', N'0000000319', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (321, N'Trịnh Hiếu', N'user0320@gmail.com', N'0000000320', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (322, N'Lương Khánh', N'user0321@gmail.com', N'0000000321', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (323, N'Hoàng Thiện', N'user0322@gmail.com', N'0000000322', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (324, N'Lương Giang', N'user0323@gmail.com', N'0000000323', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (325, N'Ngô Hiếu', N'user0324@gmail.com', N'0000000324', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (326, N'Đặng Nhung', N'user0325@gmail.com', N'0000000325', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (327, N'Lê Tùng', N'user0326@gmail.com', N'0000000326', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (328, N'Phạm Quỳnh', N'user0327@gmail.com', N'0000000327', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (329, N'Mai An', N'user0328@gmail.com', N'0000000328', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (330, N'Dương Cường', N'user0329@gmail.com', N'0000000329', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (331, N'Dương Quỳnh', N'user0330@gmail.com', N'0000000330', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (332, N'Lương Thu', N'user0331@gmail.com', N'0000000331', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (333, N'Hoàng Tài', N'user0332@gmail.com', N'0000000332', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (334, N'Hồ Việt', N'user0333@gmail.com', N'0000000333', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (335, N'Phạm Tiến', N'user0334@gmail.com', N'0000000334', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (336, N'Tô Thảo', N'user0335@gmail.com', N'0000000335', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (337, N'Đặng Duy', N'user0336@gmail.com', N'0000000336', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (338, N'Trịnh Vân', N'user0337@gmail.com', N'0000000337', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (339, N'Trịnh Phát', N'user0338@gmail.com', N'0000000338', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (340, N'Phan Giang', N'user0339@gmail.com', N'0000000339', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (341, N'Nguyễn Hải', N'user0340@gmail.com', N'0000000340', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (342, N'Hoàng Phong', N'user0341@gmail.com', N'0000000341', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (343, N'Ngô Quỳnh', N'user0342@gmail.com', N'0000000342', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (344, N'Lê Châu', N'user0343@gmail.com', N'0000000343', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (345, N'Vũ Đạt', N'user0344@gmail.com', N'0000000344', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (346, N'Tô Vân', N'user0345@gmail.com', N'0000000345', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (347, N'Ngô Hải', N'user0346@gmail.com', N'0000000346', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (348, N'Phan An', N'user0347@gmail.com', N'0000000347', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (349, N'Đỗ Ngọc', N'user0348@gmail.com', N'0000000348', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (350, N'Đỗ Vy', N'user0349@gmail.com', N'0000000349', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (351, N'Lý Sơn', N'user0350@gmail.com', N'0000000350', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (352, N'Trịnh Thắng', N'user0351@gmail.com', N'0000000351', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (353, N'Mai Hương', N'user0352@gmail.com', N'0000000352', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (354, N'Đặng Quỳnh', N'user0353@gmail.com', N'0000000353', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (355, N'Phạm Phong', N'user0354@gmail.com', N'0000000354', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (356, N'Phạm Sơn', N'user0355@gmail.com', N'0000000355', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (357, N'Lương Linh', N'user0356@gmail.com', N'0000000356', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (358, N'Phạm Minh', N'user0357@gmail.com', N'0000000357', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (359, N'Trịnh Ngọc', N'user0358@gmail.com', N'0000000358', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (360, N'Võ Tuấn', N'user0359@gmail.com', N'0000000359', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (361, N'Trần Tâm', N'user0360@gmail.com', N'0000000360', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (362, N'Tô Thu', N'user0361@gmail.com', N'0000000361', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (363, N'Nguyễn An', N'user0362@gmail.com', N'0000000362', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (364, N'Hoàng Tùng', N'user0363@gmail.com', N'0000000363', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (365, N'Hoàng Châu', N'user0364@gmail.com', N'0000000364', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (366, N'Nguyễn Hải', N'user0365@gmail.com', N'0000000365', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (367, N'Võ Thu', N'user0366@gmail.com', N'0000000366', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (368, N'Lê Ngọc', N'user0367@gmail.com', N'0000000367', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (369, N'Lương Vân', N'user0368@gmail.com', N'0000000368', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (370, N'Đinh Bảo', N'user0369@gmail.com', N'0000000369', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (371, N'Hồ Khang', N'user0370@gmail.com', N'0000000370', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (372, N'Đỗ Quỳnh', N'user0371@gmail.com', N'0000000371', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (373, N'Đặng Phát', N'user0372@gmail.com', N'0000000372', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (374, N'Đặng Anh', N'user0373@gmail.com', N'0000000373', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (375, N'Hồ Thu', N'user0374@gmail.com', N'0000000374', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (376, N'Hồ Yến', N'user0375@gmail.com', N'0000000375', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (377, N'Hoàng Linh', N'user0376@gmail.com', N'0000000376', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (378, N'Lương Bảo', N'user0377@gmail.com', N'0000000377', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (379, N'Vũ Phong', N'user0378@gmail.com', N'0000000378', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (380, N'Lê Phúc', N'user0379@gmail.com', N'0000000379', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (381, N'Dương Linh', N'user0380@gmail.com', N'0000000380', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (382, N'Phạm Cường', N'user0381@gmail.com', N'0000000381', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (383, N'Lương Long', N'user0382@gmail.com', N'0000000382', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (384, N'Đặng Phúc', N'user0383@gmail.com', N'0000000383', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (385, N'Phan Hải', N'user0384@gmail.com', N'0000000384', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (386, N'Tô Bảo', N'user0385@gmail.com', N'0000000385', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (387, N'Tô Cường', N'user0386@gmail.com', N'0000000386', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (388, N'Mai Hằng', N'user0387@gmail.com', N'0000000387', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (389, N'Đặng Hà', N'user0388@gmail.com', N'0000000388', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (390, N'Dương Mai', N'user0389@gmail.com', N'0000000389', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (391, N'Phạm Dũng', N'user0390@gmail.com', N'0000000390', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (392, N'Lê Minh', N'user0391@gmail.com', N'0000000391', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (393, N'Phan Anh', N'user0392@gmail.com', N'0000000392', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (394, N'Lê Hà', N'user0393@gmail.com', N'0000000393', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (395, N'Hồ Long', N'user0394@gmail.com', N'0000000394', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (396, N'Bùi Tùng', N'user0395@gmail.com', N'0000000395', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (397, N'Ngô Thu', N'user0396@gmail.com', N'0000000396', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (398, N'Trần Việt', N'user0397@gmail.com', N'0000000397', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (399, N'Lương Thiện', N'user0398@gmail.com', N'0000000398', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (400, N'Hoàng Việt', N'user0399@gmail.com', N'0000000399', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (401, N'Ngô Tâm', N'user0400@gmail.com', N'0000000400', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (402, N'Võ Giang', N'user0401@gmail.com', N'0000000401', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (403, N'Tô An', N'user0402@gmail.com', N'0000000402', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (404, N'Võ Anh', N'user0403@gmail.com', N'0000000403', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (405, N'Hồ Tâm', N'user0404@gmail.com', N'0000000404', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (406, N'Hoàng Mai', N'user0405@gmail.com', N'0000000405', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (407, N'Phạm Thảo', N'user0406@gmail.com', N'0000000406', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (408, N'Hoàng Giang', N'user0407@gmail.com', N'0000000407', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (409, N'Đỗ Ngọc', N'user0408@gmail.com', N'0000000408', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (410, N'Mai Duy', N'user0409@gmail.com', N'0000000409', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (411, N'Trịnh Thắng', N'user0410@gmail.com', N'0000000410', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (412, N'Lê Vân', N'user0411@gmail.com', N'0000000411', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (413, N'Tô Phong', N'user0412@gmail.com', N'0000000412', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (414, N'Võ Lan', N'user0413@gmail.com', N'0000000413', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (415, N'Nguyễn Giang', N'user0414@gmail.com', N'0000000414', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (416, N'Nguyễn Hương', N'user0415@gmail.com', N'0000000415', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (417, N'Tô Hà', N'user0416@gmail.com', N'0000000416', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (418, N'Ngô Tài', N'user0417@gmail.com', N'0000000417', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (419, N'Phạm Hằng', N'user0418@gmail.com', N'0000000418', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (420, N'Lương Thu', N'user0419@gmail.com', N'0000000419', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (421, N'Hoàng Hà', N'user0420@gmail.com', N'0000000420', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (422, N'Trần Giang', N'user0421@gmail.com', N'0000000421', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (423, N'Dương Bình', N'user0422@gmail.com', N'0000000422', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (424, N'Lê Thiện', N'user0423@gmail.com', N'0000000423', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (425, N'Trần Anh', N'user0424@gmail.com', N'0000000424', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (426, N'Tô Bảo', N'user0425@gmail.com', N'0000000425', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (427, N'Hoàng Vy', N'user0426@gmail.com', N'0000000426', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (428, N'Ngô Ngọc', N'user0427@gmail.com', N'0000000427', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (429, N'Trần Quỳnh', N'user0428@gmail.com', N'0000000428', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (430, N'Tô Vy', N'user0429@gmail.com', N'0000000429', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (431, N'Hoàng Bảo', N'user0430@gmail.com', N'0000000430', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (432, N'Lương Nga', N'user0431@gmail.com', N'0000000431', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (433, N'Trần Tuấn', N'user0432@gmail.com', N'0000000432', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (434, N'Bùi Hương', N'user0433@gmail.com', N'0000000433', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (435, N'Hồ Duy', N'user0434@gmail.com', N'0000000434', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (436, N'Mai Duy', N'user0435@gmail.com', N'0000000435', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (437, N'Bùi Mai', N'user0436@gmail.com', N'0000000436', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (438, N'Lương Vân', N'user0437@gmail.com', N'0000000437', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (439, N'Lương Tuấn', N'user0438@gmail.com', N'0000000438', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (440, N'Hồ Hà', N'user0439@gmail.com', N'0000000439', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (441, N'Nguyễn Cường', N'user0440@gmail.com', N'0000000440', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (442, N'Hồ Khánh', N'user0441@gmail.com', N'0000000441', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (443, N'Dương Linh', N'user0442@gmail.com', N'0000000442', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (444, N'Lê Nhung', N'user0443@gmail.com', N'0000000443', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (445, N'Nguyễn Tâm', N'user0444@gmail.com', N'0000000444', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (446, N'Bùi Khang', N'user0445@gmail.com', N'0000000445', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (447, N'Võ Phát', N'user0446@gmail.com', N'0000000446', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (448, N'Lý Phát', N'user0447@gmail.com', N'0000000447', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (449, N'Đỗ Khang', N'user0448@gmail.com', N'0000000448', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (450, N'Đinh Thảo', N'user0449@gmail.com', N'0000000449', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (451, N'Lý Hải', N'user0450@gmail.com', N'0000000450', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (452, N'Võ Giang', N'user0451@gmail.com', N'0000000451', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (453, N'Nguyễn Tiến', N'user0452@gmail.com', N'0000000452', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (454, N'Võ Tuấn', N'user0453@gmail.com', N'0000000453', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (455, N'Vũ Giang', N'user0454@gmail.com', N'0000000454', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (456, N'Vũ Phong', N'user0455@gmail.com', N'0000000455', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (457, N'Nguyễn Nghĩa', N'user0456@gmail.com', N'0000000456', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (458, N'Hồ Hùng', N'user0457@gmail.com', N'0000000457', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (459, N'Phạm Khánh', N'user0458@gmail.com', N'0000000458', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (460, N'Võ Tiến', N'user0459@gmail.com', N'0000000459', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (461, N'Lê Duy', N'user0460@gmail.com', N'0000000460', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (462, N'Mai Tùng', N'user0461@gmail.com', N'0000000461', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (463, N'Ngô Nghĩa', N'user0462@gmail.com', N'0000000462', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (464, N'Lý Vy', N'user0463@gmail.com', N'0000000463', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (465, N'Võ Hà', N'user0464@gmail.com', N'0000000464', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (466, N'Phan Tuấn', N'user0465@gmail.com', N'0000000465', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (467, N'Võ Hằng', N'user0466@gmail.com', N'0000000466', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (468, N'Đặng Bình', N'user0467@gmail.com', N'0000000467', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (469, N'Vũ Giang', N'user0468@gmail.com', N'0000000468', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (470, N'Ngô Bình', N'user0469@gmail.com', N'0000000469', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (471, N'Phan Bảo', N'user0470@gmail.com', N'0000000470', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (472, N'Lý Thảo', N'user0471@gmail.com', N'0000000471', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (473, N'Tô Nam', N'user0472@gmail.com', N'0000000472', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (474, N'Lê Nhung', N'user0473@gmail.com', N'0000000473', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (475, N'Lương Hải', N'user0474@gmail.com', N'0000000474', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (476, N'Hồ Cường', N'user0475@gmail.com', N'0000000475', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (477, N'Tô Thắng', N'user0476@gmail.com', N'0000000476', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (478, N'Hoàng Ngọc', N'user0477@gmail.com', N'0000000477', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (479, N'Vũ Giang', N'user0478@gmail.com', N'0000000478', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (480, N'Lý Hà', N'user0479@gmail.com', N'0000000479', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (481, N'Lương Phát', N'user0480@gmail.com', N'0000000480', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (482, N'Lê Phong', N'user0481@gmail.com', N'0000000481', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (483, N'Ngô Hằng', N'user0482@gmail.com', N'0000000482', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (484, N'Trần Anh', N'user0483@gmail.com', N'0000000483', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (485, N'Trần Tiến', N'user0484@gmail.com', N'0000000484', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (486, N'Bùi Bình', N'user0485@gmail.com', N'0000000485', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (487, N'Trịnh Cường', N'user0486@gmail.com', N'0000000486', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (488, N'Phạm Vy', N'user0487@gmail.com', N'0000000487', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (489, N'Trần Hải', N'user0488@gmail.com', N'0000000488', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (490, N'Lý Anh', N'user0489@gmail.com', N'0000000489', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (491, N'Đặng Vy', N'user0490@gmail.com', N'0000000490', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (492, N'Nguyễn Châu', N'user0491@gmail.com', N'0000000491', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (493, N'Trần Yến', N'user0492@gmail.com', N'0000000492', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (494, N'Tô Vân', N'user0493@gmail.com', N'0000000493', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (495, N'Lý Châu', N'user0494@gmail.com', N'0000000494', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (496, N'Tô Ngọc', N'user0495@gmail.com', N'0000000495', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (497, N'Đặng Quân', N'user0496@gmail.com', N'0000000496', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (498, N'Lương Hiếu', N'user0497@gmail.com', N'0000000497', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (499, N'Nguyễn Thảo', N'user0498@gmail.com', N'0000000498', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (500, N'Lương Phúc', N'user0499@gmail.com', N'0000000499', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (501, N'Tô Nam', N'user0500@gmail.com', N'0000000500', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (502, N'Đỗ Hà', N'user0501@gmail.com', N'0000000501', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (503, N'Hoàng Thủy', N'user0502@gmail.com', N'0000000502', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (504, N'Đặng Duy', N'user0503@gmail.com', N'0000000503', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (505, N'Lê Thiện', N'user0504@gmail.com', N'0000000504', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (506, N'Mai Hương', N'user0505@gmail.com', N'0000000505', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (507, N'Đặng Vân', N'user0506@gmail.com', N'0000000506', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (508, N'Trần Khang', N'user0507@gmail.com', N'0000000507', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (509, N'Lý Sơn', N'user0508@gmail.com', N'0000000508', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (510, N'Đặng Hải', N'user0509@gmail.com', N'0000000509', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (511, N'Lý Tài', N'user0510@gmail.com', N'0000000510', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (512, N'Bùi Thủy', N'user0511@gmail.com', N'0000000511', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (513, N'Trịnh Quân', N'user0512@gmail.com', N'0000000512', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (514, N'Lương Châu', N'user0513@gmail.com', N'0000000513', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (515, N'Hồ Dũng', N'user0514@gmail.com', N'0000000514', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (516, N'Nguyễn Tùng', N'user0515@gmail.com', N'0000000515', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (517, N'Hoàng Anh', N'user0516@gmail.com', N'0000000516', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (518, N'Tô Quân', N'user0517@gmail.com', N'0000000517', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (519, N'Dương Hà', N'user0518@gmail.com', N'0000000518', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (520, N'Lý Giang', N'user0519@gmail.com', N'0000000519', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (521, N'Đỗ Tâm', N'user0520@gmail.com', N'0000000520', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (522, N'Trịnh Quân', N'user0521@gmail.com', N'0000000521', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (523, N'Hoàng Long', N'user0522@gmail.com', N'0000000522', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (524, N'Phan Duy', N'user0523@gmail.com', N'0000000523', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (525, N'Võ Vy', N'user0524@gmail.com', N'0000000524', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (526, N'Hồ Hà', N'user0525@gmail.com', N'0000000525', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (527, N'Đỗ Tâm', N'user0526@gmail.com', N'0000000526', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (528, N'Vũ Hải', N'user0527@gmail.com', N'0000000527', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (529, N'Bùi Nghĩa', N'user0528@gmail.com', N'0000000528', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (530, N'Võ An', N'user0529@gmail.com', N'0000000529', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (531, N'Nguyễn Dũng', N'user0530@gmail.com', N'0000000530', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (532, N'Lý Bảo', N'user0531@gmail.com', N'0000000531', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (533, N'Bùi Phúc', N'user0532@gmail.com', N'0000000532', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (534, N'Lê Phong', N'user0533@gmail.com', N'0000000533', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (535, N'Đinh Châu', N'user0534@gmail.com', N'0000000534', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (536, N'Phan Tài', N'user0535@gmail.com', N'0000000535', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (537, N'Dương Quỳnh', N'user0536@gmail.com', N'0000000536', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (538, N'Trần Phúc', N'user0537@gmail.com', N'0000000537', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (539, N'Võ Thủy', N'user0538@gmail.com', N'0000000538', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (540, N'Hoàng Việt', N'user0539@gmail.com', N'0000000539', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (541, N'Ngô Anh', N'user0540@gmail.com', N'0000000540', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (542, N'Ngô Phúc', N'user0541@gmail.com', N'0000000541', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (543, N'Đinh Thiện', N'user0542@gmail.com', N'0000000542', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (544, N'Lý Hương', N'user0543@gmail.com', N'0000000543', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (545, N'Đinh Dũng', N'user0544@gmail.com', N'0000000544', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (546, N'Ngô Khang', N'user0545@gmail.com', N'0000000545', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (547, N'Đặng Mai', N'user0546@gmail.com', N'0000000546', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (548, N'Lương Giang', N'user0547@gmail.com', N'0000000547', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (549, N'Đinh Đạt', N'user0548@gmail.com', N'0000000548', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (550, N'Mai Phúc', N'user0549@gmail.com', N'0000000549', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (551, N'Tô Bình', N'user0550@gmail.com', N'0000000550', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (552, N'Tô Vy', N'user0551@gmail.com', N'0000000551', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (553, N'Dương Bảo', N'user0552@gmail.com', N'0000000552', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (554, N'Ngô Tài', N'user0553@gmail.com', N'0000000553', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (555, N'Bùi Cường', N'user0554@gmail.com', N'0000000554', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (556, N'Trịnh Thắng', N'user0555@gmail.com', N'0000000555', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (557, N'Hồ Bảo', N'user0556@gmail.com', N'0000000556', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (558, N'Đặng Tài', N'user0557@gmail.com', N'0000000557', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (559, N'Đinh Giang', N'user0558@gmail.com', N'0000000558', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (560, N'Trịnh Thu', N'user0559@gmail.com', N'0000000559', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (561, N'Hồ Khang', N'user0560@gmail.com', N'0000000560', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (562, N'Trần Thu', N'user0561@gmail.com', N'0000000561', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (563, N'Trần Yến', N'user0562@gmail.com', N'0000000562', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (564, N'Phạm Nhung', N'user0563@gmail.com', N'0000000563', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (565, N'Đinh Phúc', N'user0564@gmail.com', N'0000000564', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (566, N'Đặng Đạt', N'user0565@gmail.com', N'0000000565', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (567, N'Đỗ Yến', N'user0566@gmail.com', N'0000000566', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (568, N'Trần Hiếu', N'user0567@gmail.com', N'0000000567', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (569, N'Hoàng Thắng', N'user0568@gmail.com', N'0000000568', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (570, N'Phan Yến', N'user0569@gmail.com', N'0000000569', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (571, N'Bùi Mai', N'user0570@gmail.com', N'0000000570', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (572, N'Đặng Hiếu', N'user0571@gmail.com', N'0000000571', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (573, N'Phạm Vy', N'user0572@gmail.com', N'0000000572', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (574, N'Trịnh Hải', N'user0573@gmail.com', N'0000000573', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (575, N'Mai Tuấn', N'user0574@gmail.com', N'0000000574', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (576, N'Phan Hải', N'user0575@gmail.com', N'0000000575', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (577, N'Phạm Dũng', N'user0576@gmail.com', N'0000000576', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (578, N'Bùi Bảo', N'user0577@gmail.com', N'0000000577', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (579, N'Ngô Yến', N'user0578@gmail.com', N'0000000578', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (580, N'Lý Giang', N'user0579@gmail.com', N'0000000579', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (581, N'Bùi Thắng', N'user0580@gmail.com', N'0000000580', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (582, N'Tô Hiếu', N'user0581@gmail.com', N'0000000581', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (583, N'Nguyễn Hiếu', N'user0582@gmail.com', N'0000000582', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (584, N'Đặng Quân', N'user0583@gmail.com', N'0000000583', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (585, N'Phan Hương', N'user0584@gmail.com', N'0000000584', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (586, N'Đặng Thu', N'user0585@gmail.com', N'0000000585', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (587, N'Tô Tài', N'user0586@gmail.com', N'0000000586', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (588, N'Đinh Khang', N'user0587@gmail.com', N'0000000587', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (589, N'Ngô Ngọc', N'user0588@gmail.com', N'0000000588', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (590, N'Phan Hiếu', N'user0589@gmail.com', N'0000000589', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (591, N'Ngô Vy', N'user0590@gmail.com', N'0000000590', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (592, N'Phan Long', N'user0591@gmail.com', N'0000000591', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (593, N'Phan Tuấn', N'user0592@gmail.com', N'0000000592', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (594, N'Đỗ Tâm', N'user0593@gmail.com', N'0000000593', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (595, N'Phan Thảo', N'user0594@gmail.com', N'0000000594', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (596, N'Phạm Phúc', N'user0595@gmail.com', N'0000000595', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (597, N'Hồ Phúc', N'user0596@gmail.com', N'0000000596', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (598, N'Trần Hằng', N'user0597@gmail.com', N'0000000597', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (599, N'Đặng Tài', N'user0598@gmail.com', N'0000000598', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (600, N'Dương Tuấn', N'user0599@gmail.com', N'0000000599', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (601, N'Đinh Hùng', N'user0600@gmail.com', N'0000000600', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (602, N'Hoàng Giang', N'user0601@gmail.com', N'0000000601', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (603, N'Lương Yến', N'user0602@gmail.com', N'0000000602', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (604, N'Hoàng An', N'user0603@gmail.com', N'0000000603', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (605, N'Lương Hải', N'user0604@gmail.com', N'0000000604', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (606, N'Nguyễn Yến', N'user0605@gmail.com', N'0000000605', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (607, N'Đinh Tài', N'user0606@gmail.com', N'0000000606', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (608, N'Nguyễn Duy', N'user0607@gmail.com', N'0000000607', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (609, N'Lý Anh', N'user0608@gmail.com', N'0000000608', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (610, N'Lý Hương', N'user0609@gmail.com', N'0000000609', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (611, N'Đỗ Long', N'user0610@gmail.com', N'0000000610', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (612, N'Phan Thắng', N'user0611@gmail.com', N'0000000611', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (613, N'Đinh Khang', N'user0612@gmail.com', N'0000000612', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (614, N'Phan Cường', N'user0613@gmail.com', N'0000000613', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (615, N'Vũ Vân', N'user0614@gmail.com', N'0000000614', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (616, N'Đặng Lan', N'user0615@gmail.com', N'0000000615', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (617, N'Dương Long', N'user0616@gmail.com', N'0000000616', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (618, N'Lê Vy', N'user0617@gmail.com', N'0000000617', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (619, N'Phan Phát', N'user0618@gmail.com', N'0000000618', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (620, N'Đặng Yến', N'user0619@gmail.com', N'0000000619', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (621, N'Lê Hằng', N'user0620@gmail.com', N'0000000620', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (622, N'Trịnh Lan', N'user0621@gmail.com', N'0000000621', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (623, N'Tô Cường', N'user0622@gmail.com', N'0000000622', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (624, N'Lê Minh', N'user0623@gmail.com', N'0000000623', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (625, N'Võ Tùng', N'user0624@gmail.com', N'0000000624', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (626, N'Mai Quỳnh', N'user0625@gmail.com', N'0000000625', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (627, N'Đỗ Hải', N'user0626@gmail.com', N'0000000626', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (628, N'Nguyễn Hằng', N'user0627@gmail.com', N'0000000627', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (629, N'Hoàng Anh', N'user0628@gmail.com', N'0000000628', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (630, N'Bùi Hiếu', N'user0629@gmail.com', N'0000000629', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (631, N'Đặng Việt', N'user0630@gmail.com', N'0000000630', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (632, N'Đặng Ngọc', N'user0631@gmail.com', N'0000000631', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (633, N'Hồ Nga', N'user0632@gmail.com', N'0000000632', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (634, N'Lương Thiện', N'user0633@gmail.com', N'0000000633', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (635, N'Lê Thu', N'user0634@gmail.com', N'0000000634', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (636, N'Mai Vân', N'user0635@gmail.com', N'0000000635', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (637, N'Mai Thắng', N'user0636@gmail.com', N'0000000636', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (638, N'Tô Phát', N'user0637@gmail.com', N'0000000637', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (639, N'Hoàng Yến', N'user0638@gmail.com', N'0000000638', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (640, N'Vũ Minh', N'user0639@gmail.com', N'0000000639', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (641, N'Phan Linh', N'user0640@gmail.com', N'0000000640', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (642, N'Phạm Nga', N'user0641@gmail.com', N'0000000641', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (643, N'Bùi Thu', N'user0642@gmail.com', N'0000000642', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (644, N'Lê Tùng', N'user0643@gmail.com', N'0000000643', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (645, N'Trần Hải', N'user0644@gmail.com', N'0000000644', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (646, N'Dương Hùng', N'user0645@gmail.com', N'0000000645', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (647, N'Đỗ Cường', N'user0646@gmail.com', N'0000000646', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (648, N'Võ Dũng', N'user0647@gmail.com', N'0000000647', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (649, N'Vũ Hằng', N'user0648@gmail.com', N'0000000648', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (650, N'Vũ Tiến', N'user0649@gmail.com', N'0000000649', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (651, N'Dương Việt', N'user0650@gmail.com', N'0000000650', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (652, N'Đặng An', N'user0651@gmail.com', N'0000000651', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (653, N'Nguyễn Đạt', N'user0652@gmail.com', N'0000000652', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (654, N'Dương Thắng', N'user0653@gmail.com', N'0000000653', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (655, N'Dương Tuấn', N'user0654@gmail.com', N'0000000654', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (656, N'Hồ Nga', N'user0655@gmail.com', N'0000000655', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (657, N'Lý Vân', N'user0656@gmail.com', N'0000000656', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (658, N'Võ Tuấn', N'user0657@gmail.com', N'0000000657', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (659, N'Đặng Quỳnh', N'user0658@gmail.com', N'0000000658', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (660, N'Võ Thiện', N'user0659@gmail.com', N'0000000659', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (661, N'Bùi Khánh', N'user0660@gmail.com', N'0000000660', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (662, N'Võ Châu', N'user0661@gmail.com', N'0000000661', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (663, N'Vũ Cường', N'user0662@gmail.com', N'0000000662', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (664, N'Đinh Tùng', N'user0663@gmail.com', N'0000000663', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (665, N'Ngô Phát', N'user0664@gmail.com', N'0000000664', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (666, N'Lê Cường', N'user0665@gmail.com', N'0000000665', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (667, N'Tô Tùng', N'user0666@gmail.com', N'0000000666', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (668, N'Đặng Vy', N'user0667@gmail.com', N'0000000667', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (669, N'Trần Sơn', N'user0668@gmail.com', N'0000000668', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (670, N'Vũ Lan', N'user0669@gmail.com', N'0000000669', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (671, N'Vũ Tùng', N'user0670@gmail.com', N'0000000670', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (672, N'Đỗ Quỳnh', N'user0671@gmail.com', N'0000000671', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (673, N'Mai Hương', N'user0672@gmail.com', N'0000000672', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (674, N'Lý Quỳnh', N'user0673@gmail.com', N'0000000673', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (675, N'Nguyễn Bình', N'user0674@gmail.com', N'0000000674', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (676, N'Lý Yến', N'user0675@gmail.com', N'0000000675', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (677, N'Dương Hiếu', N'user0676@gmail.com', N'0000000676', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (678, N'Đinh Khánh', N'user0677@gmail.com', N'0000000677', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (679, N'Hoàng Thiện', N'user0678@gmail.com', N'0000000678', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (680, N'Mai Giang', N'user0679@gmail.com', N'0000000679', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (681, N'Mai Quân', N'user0680@gmail.com', N'0000000680', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (682, N'Lương An', N'user0681@gmail.com', N'0000000681', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (683, N'Lương Hiếu', N'user0682@gmail.com', N'0000000682', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (684, N'Ngô Quân', N'user0683@gmail.com', N'0000000683', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (685, N'Phan Hương', N'user0684@gmail.com', N'0000000684', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (686, N'Đặng Đạt', N'user0685@gmail.com', N'0000000685', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (687, N'Đỗ Duy', N'user0686@gmail.com', N'0000000686', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (688, N'Bùi Khánh', N'user0687@gmail.com', N'0000000687', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (689, N'Vũ Minh', N'user0688@gmail.com', N'0000000688', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (690, N'Lương Tuấn', N'user0689@gmail.com', N'0000000689', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (691, N'Tô Tài', N'user0690@gmail.com', N'0000000690', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (692, N'Hoàng Minh', N'user0691@gmail.com', N'0000000691', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (693, N'Lương Giang', N'user0692@gmail.com', N'0000000692', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (694, N'Bùi Long', N'user0693@gmail.com', N'0000000693', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (695, N'Lý Hiếu', N'user0694@gmail.com', N'0000000694', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (696, N'Hoàng Hùng', N'user0695@gmail.com', N'0000000695', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (697, N'Tô Châu', N'user0696@gmail.com', N'0000000696', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (698, N'Võ Linh', N'user0697@gmail.com', N'0000000697', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (699, N'Đinh Bình', N'user0698@gmail.com', N'0000000698', 1, 0, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');


GO
INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (700, N'Mai Minh', N'user0699@gmail.com', N'0000000699', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (701, N'Mai Phúc', N'user0700@gmail.com', N'0000000700', 1, 1, N'$2b$12$g0a3CeaibYOXA6tb7YMvp.b2j9S5/B979FwZoByXm817Fqn0myOea');

INSERT	[dbo].[User] (
	[ID],
	[HoTen],
	[Email],
	[SDT],
	[RoleId],
	[TrangThai],
	[PasswordHash]
)
VALUES               (702, N'an', N'an@gmail.com', N'1900000832', 1, 1, N'$2b$10$eYmXEMjSPGt7PSYE1gGDXumPxgKdh0cicXzOozynqSNpKSxBooG8O');

SET IDENTITY_INSERT [dbo].[User] OFF;


GO
SET ANSI_PADDING ON;


GO
/****** Object:  Index [UQ_User_Email]    Script Date: 10/17/2026 11:17:50 AM ******/
ALTER TABLE [dbo].[User]
	ADD CONSTRAINT [UQ_User_Email] UNIQUE NONCLUSTERED ([Email] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY];


GO
ALTER TABLE [dbo].[CongViec]
	ADD CONSTRAINT [DF_CongViec_TrangThai] DEFAULT ((0)) FOR [TrangThai];


GO
ALTER TABLE [dbo].[User]
	ADD CONSTRAINT [DF_User_TrangThai] DEFAULT ((1)) FOR [TrangThai];


GO
ALTER TABLE [dbo].[CongViec] WITH CHECK
	ADD CONSTRAINT [FK_CongViec_User] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([ID]) ON DELETE CASCADE;


GO
ALTER TABLE [dbo].[CongViec] CHECK CONSTRAINT [FK_CongViec_User];


GO
USE [master];


GO
ALTER DATABASE [ManagementDb]
	SET READ_WRITE;