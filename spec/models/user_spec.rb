require 'rails_helper'

RSpec.describe User, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "requires an email address" do
      user = build(:user, email_address: nil)
      expect(user).not_to be_valid
      expect(user.errors[:email_address]).to include("can't be blank")
    end

    it "requires a unique email address" do
      create(:user, email_address: "test@example.com")
      user = build(:user, email_address: "test@example.com")
      expect(user).not_to be_valid
      expect(user.errors[:email_address]).to include("has already been taken")
    end

    it "requires a valid email format" do
      user = build(:user, email_address: "invalid-email")
      expect(user).not_to be_valid
      expect(user.errors[:email_address]).to include("is invalid")
    end

    it "requires a password" do
      user = build(:user, password: nil)
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("can't be blank")
    end

    it "requires password confirmation to match" do
      user = build(:user, password: "password", password_confirmation: "different")
      expect(user).not_to be_valid
      expect(user.errors[:password_confirmation]).to include("doesn't match Password")
    end
  end

  describe "associations" do
    it "has many sessions" do
      association = User.reflect_on_association(:sessions)
      expect(association.macro).to eq(:has_many)
      expect(association.options[:dependent]).to eq(:destroy)
    end

    it "destroys associated sessions when user is destroyed" do
      user = create(:user)
      session = user.sessions.create!(user_agent: "Test", ip_address: "127.0.0.1")

      expect { user.destroy }.to change(Session, :count).by(-1)
    end
  end

  describe "email normalization" do
    it "normalizes email address by stripping whitespace and downcasing" do
      user = create(:user, email_address: "  TEST@EXAMPLE.COM  ")
      expect(user.email_address).to eq("test@example.com")
    end
  end

  describe "authentication" do
    it "authenticates with correct credentials" do
      user = create(:user, email_address: "test@example.com", password: "password")
      authenticated_user = User.authenticate_by(email_address: "test@example.com", password: "password")
      expect(authenticated_user).to eq(user)
    end

    it "does not authenticate with incorrect password" do
      user = create(:user, email_address: "test@example.com", password: "password")
      authenticated_user = User.authenticate_by(email_address: "test@example.com", password: "wrong")
      expect(authenticated_user).to be_nil
    end

    it "does not authenticate with non-existent email" do
      authenticated_user = User.authenticate_by(email_address: "nonexistent@example.com", password: "password")
      expect(authenticated_user).to be_nil
    end
  end
end
