module.exports = class BaseCommand {
  constructor(name, category, aliases, status, permissions, allowedChannels, blockedChannels, allowedRoles, blockedRoles, cooldownStatus, cooldownTime, cooldownPermissions, cooldownChannels, cooldownRoles, cooldownReminder) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.status = status;
    this.permissions = permissions;
    this.allowedChannels = allowedChannels;
    this.blockedChannels = blockedChannels;
    this.allowedRoles = allowedRoles;
    this.blockedRoles = blockedRoles;
    this.cooldownStatus = cooldownStatus;
    this.cooldownTime = cooldownTime;
    this.cooldownPermissions = cooldownPermissions;
    this.cooldownChannels = cooldownChannels;
    this.cooldownRoles = cooldownRoles;
    this.cooldownReminder = cooldownReminder;
  }
}
