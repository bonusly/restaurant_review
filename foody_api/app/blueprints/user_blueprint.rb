class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :email_address, :created_at, :updated_at
end
