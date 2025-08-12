require 'rails_helper'

RSpec.describe "UsersController", type: :request do
  describe "GET /users/new" do
    it "renders the sign up form" do
      get new_user_path

      expect(response).to have_http_status(:ok)
      expect(response.body).to include("Sign up")
      expect(response.body).to include("email_address")
      expect(response.body).to include("password")
      expect(response.body).to include("password_confirmation")
    end

    it "allows unauthenticated access" do
      get new_user_path

      expect(response).not_to redirect_to(new_session_path)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /users" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          user: {
            email_address: "newuser@example.com",
            password: "password123",
            password_confirmation: "password123"
          }
        }
      end

      it "creates a new user" do
        expect {
          post users_path, params: valid_params
        }.to change(User, :count).by(1)
      end

      it "signs in the new user automatically" do
        post users_path, params: valid_params

        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(response).to have_http_status(:ok)
      end

      it "creates a session for the new user" do
        expect {
          post users_path, params: valid_params
        }.to change(Session, :count).by(1)
      end

      it "shows success notice" do
        post users_path, params: valid_params

        expect(flash[:notice]).to eq("Welcome! Your account has been created successfully.")
      end

      it "normalizes email address" do
        post users_path, params: {
          user: {
            email_address: "  NEWUSER@EXAMPLE.COM  ",
            password: "password123",
            password_confirmation: "password123"
          }
        }

        user = User.last
        expect(user.email_address).to eq("newuser@example.com")
      end
    end

    context "with invalid parameters" do
      it "does not create a user with invalid email" do
        expect {
          post users_path, params: {
            user: {
              email_address: "invalid-email",
              password: "password123",
              password_confirmation: "password123"
            }
          }
        }.not_to change(User, :count)
      end

      it "does not create a user with mismatched passwords" do
        expect {
          post users_path, params: {
            user: {
              email_address: "newuser@example.com",
              password: "password123",
              password_confirmation: "different_password"
            }
          }
        }.not_to change(User, :count)
      end

      it "does not create a user with duplicate email" do
        create(:user, email_address: "existing@example.com")

        expect {
          post users_path, params: {
            user: {
              email_address: "existing@example.com",
              password: "password123",
              password_confirmation: "password123"
            }
          }
        }.not_to change(User, :count)
      end

      it "renders new template with errors on invalid data" do
        post users_path, params: {
          user: {
            email_address: "invalid-email",
            password: "password123",
            password_confirmation: "different_password"
          }
        }

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.body).to include("Sign up")
        expect(response.body).to include("Please fix the following errors")
      end

      it "does not sign in user when creation fails" do
        post users_path, params: {
          user: {
            email_address: "invalid-email",
            password: "password123",
            password_confirmation: "password123"
          }
        }

        expect(response).not_to redirect_to(root_path)
        expect(Session.count).to eq(0)
      end
    end
  end
end
