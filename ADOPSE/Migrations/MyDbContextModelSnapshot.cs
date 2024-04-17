﻿// <auto-generated />
using System;
using ADOPSE.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ADOPSE.Migrations
{
    [DbContext(typeof(MyDbContext))]
    partial class MyDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0-preview.2.23128.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ADOPSE.Models.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Category");
                });

            modelBuilder.Entity("ADOPSE.Models.Difficulty", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id", "Name");

                    b.ToTable("Difficulty");
                });

            modelBuilder.Entity("ADOPSE.Models.Enrolled", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("EventId")
                        .HasColumnType("longtext");

                    b.Property<int>("ModuleId")
                        .HasColumnType("int");

                    b.Property<int>("StudentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ModuleId");

                    b.HasIndex("StudentId");

                    b.ToTable("Enrolled");
                });

            modelBuilder.Entity("ADOPSE.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Details")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Ends")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("GoogleCalendarID")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("GoogleCalendarEventID");

                    b.Property<DateTime>("LastModification")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("ModuleId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Starts")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("ModuleId");

                    b.ToTable("Event");
                });

            modelBuilder.Entity("ADOPSE.Models.Lecturer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Bio")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Website")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Lecturer");
                });

            modelBuilder.Entity("ADOPSE.Models.Module", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("Completed")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("DifficultyId")
                        .HasColumnType("int");

                    b.Property<string>("DifficultyName")
                        .HasColumnType("longtext");

                    b.Property<string>("GoogleCalendarID")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("ModuleTypeId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<int>("Rating")
                        .HasColumnType("int");

                    b.Property<int>("SubCategoryId")
                        .HasColumnType("int");

                    b.Property<int>("leaderId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ModuleTypeId");

                    b.HasIndex("leaderId");

                    b.ToTable("Module");
                });

            modelBuilder.Entity("ADOPSE.Models.ModuleType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("ModuleType");
                });

            modelBuilder.Entity("ADOPSE.Models.Student", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Student");
                });

            modelBuilder.Entity("ADOPSE.Models.SubCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("parentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("parentId");

                    b.ToTable("SubCategory");
                });

            modelBuilder.Entity("ADOPSE.Models.Enrolled", b =>
                {
                    b.HasOne("ADOPSE.Models.Module", "Module")
                        .WithMany()
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ADOPSE.Models.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Module");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("ADOPSE.Models.Event", b =>
                {
                    b.HasOne("ADOPSE.Models.Module", "Module")
                        .WithMany()
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Module");
                });

            modelBuilder.Entity("ADOPSE.Models.Module", b =>
                {
                    b.HasOne("ADOPSE.Models.ModuleType", "ModuleType")
                        .WithMany()
                        .HasForeignKey("ModuleTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ADOPSE.Models.Lecturer", "Lecturer")
                        .WithMany()
                        .HasForeignKey("leaderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Lecturer");

                    b.Navigation("ModuleType");
                });

            modelBuilder.Entity("ADOPSE.Models.SubCategory", b =>
                {
                    b.HasOne("ADOPSE.Models.Category", "parent")
                        .WithMany()
                        .HasForeignKey("parentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("parent");
                });
#pragma warning restore 612, 618
        }
    }
}
