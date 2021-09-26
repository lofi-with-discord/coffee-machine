create user coffee@localhost;
create schema coffee;

grant all on coffee.* to coffee@localhost;

create table coffee.brews (
  guildId varchar(30) not null primary key,
  channelId varchar(30) not null,
  videoURL text not null
);
